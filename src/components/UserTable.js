import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { getUsersByRoleApi, toggleUserStatusApi } from "@/service/api";
import PaginationAdmin from "@/components/PaginationAdmin";
import { useRouter } from "next/router";
import Icons from "@/components/Icons";
import { toast } from "react-toastify";

const MAX_STACK_SIZE = 5;

const UserTable = ({ role, title }) => {
  const isAuthenticated = useSelector((store) => store.logininfo.isAuthenticated);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [goldFilter, setGoldFilter] = useState("all");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortColumn, setSortColumn] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");
  const router = useRouter();

  const [pageStack, setPageStack] = useState([]);
  const [firstPageFirstId, setFirstPageFirstId] = useState(null);
  const [lastPageLastId, setLastPageLastId] = useState(null);

  const stackRef = useRef(pageStack);
  stackRef.current = pageStack;

  function buildParams(pageNum = 1) {
    return {
      role,
      emailSearch: searchTerm.trim(), // Changed to emailSearch to be explicit
      status: filterStatus,
      perPage: entriesPerPage,
      sortColumn,
      sortOrder,
      gold: goldFilter !== "all" ? goldFilter : undefined,
      page: pageNum
    };
  }

  // Reset all paging when filter/search changes
  useEffect(() => {
    let isMounted = true;

    async function fetchInitialPages() {
      try {
        // First fetch just the first page to show data immediately
        const firstPageRes = await getUsersByRoleApi(buildParams(1));
        let firstId = null;
        let newStack = [];

        if (firstPageRes.data.users.length > 0) {
          firstId = firstPageRes.data.users[0].id;
          const firstLastUserId = firstPageRes.data.users[firstPageRes.data.users.length - 1].id;
          
          // Set initial data immediately
          if (isMounted) {
            setUsers(firstPageRes.data.users);
            setFirstPageFirstId(firstId);
            newStack.push({
              page: 1,
              users: firstPageRes.data.users,
              beforeId: firstId,
              afterId: firstLastUserId
            });
          }
        }

        // Get total pages count in parallel with first page
        const countRes = await getUsersByRoleApi({ 
          ...buildParams(),
          countOnly: true
        });
        
        const actualTotalPages = countRes.data.totalPages;
        console.log('Initial total pages:', actualTotalPages);

        // Start background fetching of subsequent pages using afterId
        if (actualTotalPages > 1 && firstPageRes.data.users.length > 0) {
          const lastUserId = firstPageRes.data.users[firstPageRes.data.users.length - 1].id;
          const subsequentPagesPromises = [];
          
          // Fetch pages 2 to MAX_STACK_SIZE-1 in parallel using afterId
          for (let i = 2; i < MAX_STACK_SIZE && i < actualTotalPages; i++) {
            subsequentPagesPromises.push(
              getUsersByRoleApi({
                ...buildParams(i),
                afterId: lastUserId
              })
            );
          }

          // Fetch subsequent pages in parallel
          const subsequentResults = await Promise.all(subsequentPagesPromises);
          subsequentResults.forEach((res, idx) => {
            if (res.data.users.length > 0) {
              newStack.push({
                page: idx + 2,
                users: res.data.users,
                beforeId: res.data.users[0].id,
                afterId: res.data.users[res.data.users.length - 1].id
              });
            }
          });
        }

        // Finally, get last page data if there are multiple pages
        let lastId = null;
        if (actualTotalPages > 1) {
          const lastRes = await getUsersByRoleApi({
            ...buildParams(),
            last: true
          });
          
          if (lastRes.data.users.length > 0) {
            lastId = lastRes.data.users[lastRes.data.users.length - 1].id;
          }
        }

        if (isMounted) {
          setPageStack(newStack);
          setLastPageLastId(lastId);
          setTotalPages(actualTotalPages);
          
          console.log('Initial state set:', {
            stackSize: newStack.length,
            firstId,
            lastId,
            totalPages: actualTotalPages
          });
        }
      } catch (error) {
        console.error('Error in fetchInitialPages:', error);
        toast.error("Failed to load users ❌");
      }
    }

    fetchInitialPages();
    return () => { isMounted = false; };
  }, [role, filterStatus, goldFilter, searchTerm, entriesPerPage, sortColumn, sortOrder, isAuthenticated]);

  // Helper: get page from stack
  function getCachedPage(pageNum) {
    return stackRef.current.find(p => p.page === pageNum);
  }

  // Optimize the fetch and cache logic with early returns
  const fetchAndCachePage = async (pageNum, params = {}) => {
    // Early return if page is in stack
    const cached = getCachedPage(pageNum);
    if (cached) return cached.users;

    // Optimize queries for first/last pages
    let queryParams = { ...buildParams(pageNum), ...params };
    if (pageNum === 1 && firstPageFirstId) {
      queryParams.afterId = firstPageFirstId;
    } else if (pageNum === totalPages && lastPageLastId) {
      queryParams.beforeId = lastPageLastId;
      queryParams.last = true;
    }

    const res = await getUsersByRoleApi(queryParams);
    
    // Update stack with new page data
    let newStack = [...stackRef.current, {
      page: pageNum,
      users: res.data.users,
      beforeId: res.data.users[0]?.id,
      afterId: res.data.users[res.data.users.length - 1]?.id,
    }].sort((a, b) => a.page - b.page);

    // Keep only MAX_STACK_SIZE most recent pages
    if (newStack.length > MAX_STACK_SIZE) {
      // Remove pages furthest from current page
      const distance = p => Math.abs(p.page - pageNum);
      newStack.sort((a, b) => distance(a) - distance(b));
      newStack = newStack.slice(0, MAX_STACK_SIZE);
      newStack.sort((a, b) => a.page - b.page);
    }

    setPageStack(newStack);
    return res.data.users;
  };

  // Add debounce function
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Add debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 500),
    []
  );

  // Replace the search input onChange handler
  const handleSearchChange = (e) => {
    const { value } = e.target;
    e.target.value = value;
    debouncedSearch(value);
  };

  // Optimize handlePageChange to use fetchAndCachePage with better error handling
  const handlePageChange = async (pageNum) => {
    try {
      // Validate page number
      const validatedPage = Math.max(1, Math.min(pageNum, totalPages));
      if (validatedPage !== pageNum) {
        console.warn(`Adjusted invalid page number ${pageNum} to ${validatedPage}`);
      }

      // If the requested page is close to the current page, use cached data
      if (Math.abs(validatedPage - currentPage) <= 2) {
        const cached = getCachedPage(validatedPage);
        if (cached) {
          setUsers(cached.users);
          setCurrentPage(validatedPage);
          return;
        }
      }

      // Fetch new data if not cached or too far from current page
      const users = await fetchAndCachePage(validatedPage);
      setUsers(users);
      setCurrentPage(validatedPage);

      // Pre-fetch adjacent pages
      const preFetchPages = [validatedPage - 1, validatedPage + 1]
        .filter(p => p > 0 && p <= totalPages)
        .filter(p => !getCachedPage(p));
      
      await Promise.all(preFetchPages.map(p => fetchAndCachePage(p)));

    } catch (error) {
      toast.error("Failed to load users ❌");
      console.error('Error in handlePageChange:', error);
    }
  };

  // Optimize goToFirstPage function
  const goToFirstPage = async () => {
    try {
      // Get first page data
      const firstRes = await getUsersByRoleApi(buildParams(1));
      
      if (firstRes.data.users?.length > 0) {
        const firstId = firstRes.data.users[0]?.id;
        setFirstPageFirstId(firstId);

        // Keep existing pages in stack that are still in range
        const existingValidPages = stackRef.current
          .filter(p => p.page <= MAX_STACK_SIZE)
          .map(p => p.page);

        // Determine which pages we need to fetch
        const pagesToFetch = [];
        for (let i = 1; i <= Math.min(MAX_STACK_SIZE, totalPages); i++) {
          if (!existingValidPages.includes(i)) {
            pagesToFetch.push(i);
          }
        }

        // Fetch missing pages in parallel
        const fetchPromises = pagesToFetch.map(pageNum => 
          getUsersByRoleApi(buildParams(pageNum))
        );

        const results = await Promise.all(fetchPromises);

        // Build new stack
        const newPages = results.map((res, idx) => ({
          page: pagesToFetch[idx],
          users: res.data.users,
          beforeId: res.data.users[0]?.id,
          afterId: res.data.users[res.data.users.length - 1]?.id
        }));

        // Combine existing valid pages with new fetched pages
        let newStack = [
          ...stackRef.current.filter(p => p.page <= MAX_STACK_SIZE),
          ...newPages
        ].sort((a, b) => a.page - b.page)
        .slice(0, MAX_STACK_SIZE);

        setPageStack(newStack);
        setUsers(firstRes.data.users);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error going to first page:', error);
      toast.error("Failed to load first page ❌");
    }
  };

  // Optimize goToLastPage function
  const goToLastPage = async () => {
    try {
      // First get accurate count and last page data
      const [countRes, lastRes] = await Promise.all([
        getUsersByRoleApi({ 
          ...buildParams(),
          countOnly: true
        }),
        getUsersByRoleApi({
          ...buildParams(),
          last: true,
          perPage: entriesPerPage
        })
      ]);
      
      const lastPageNum = countRes.data.totalPages;
      console.log('Last page total pages:', lastPageNum);
      
      if (lastRes.data.users?.length > 0) {
        const lastId = lastRes.data.users[lastRes.data.users.length - 1]?.id;
        
        // Update total pages if different
        if (lastPageNum !== totalPages) {
          setTotalPages(lastPageNum);
        }

        // Calculate pages to fetch for the stack
        const startPage = Math.max(lastPageNum - MAX_STACK_SIZE + 1, 1);
        let stackUpdates = [];

        // Keep existing pages in stack that are still valid
        const existingValidPages = stackRef.current
          .filter(p => p.page >= startPage && p.page <= lastPageNum)
          .map(p => p.page);

        // Determine which pages we need to fetch
        const pagesToFetch = [];
        for (let i = startPage; i <= lastPageNum; i++) {
          if (!existingValidPages.includes(i)) {
            pagesToFetch.push(i);
          }
        }

        // Fetch missing pages in parallel
        const fetchPromises = pagesToFetch.map(pageNum => 
          getUsersByRoleApi({
            ...buildParams(),
            page: pageNum
          })
        );

        const results = await Promise.all(fetchPromises);

        // Build new stack entries
        results.forEach((res, idx) => {
          if (res.data.users?.length > 0) {
            stackUpdates.push({
              page: pagesToFetch[idx],
              users: res.data.users,
              beforeId: res.data.users[0]?.id,
              afterId: res.data.users[res.data.users.length - 1]?.id
            });
          }
        });

        // Combine existing valid pages with new fetched pages
        let newStack = [
          ...stackRef.current.filter(p => p.page >= startPage && p.page <= lastPageNum),
          ...stackUpdates
        ].sort((a, b) => a.page - b.page)
        .slice(-MAX_STACK_SIZE);

        // Update state
        setLastPageLastId(lastId);
        setPageStack(newStack);
        setUsers(lastRes.data.users);
        setCurrentPage(lastPageNum);
      } else {
        toast.error("No users found on last page");
      }
    } catch (error) {
      console.error('Error loading last page:', error);
      toast.error("Failed to load last page ❌");
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) handlePageChange(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) handlePageChange(currentPage + 1);
  };

  // Status toggle with reload
  const handleToggleStatus = async (id) => {
    try {
      await toggleUserStatusApi(id);
      toast.success("User status updated successfully! ✅");
      handlePageChange(currentPage);
    } catch (error) {
      toast.error("Failed to update user status. ❌");
    }
  };

  // Sorting handler
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  // Entries per page change
  const handleEntriesPerPageChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
  };

  return (
    <section className="py-lg-5 py-4 profile-page">
      <div className="container">
        <h2 className="mb-4">{title}</h2>
        {/* Search, Filter & Entries Selection */}
        <div className="d-flex justify-content-between mb-3">
          <input
            type="email"
            className="form-control w-25"
            placeholder="Search by exact email address..."
            onChange={handleSearchChange}
            defaultValue={searchTerm}
          />
          <select className="form-control w-25" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
          <select className="form-control w-25" value={goldFilter} onChange={e => setGoldFilter(e.target.value)}>
            <option value="all">All Accounts</option>
            <option value="gold">Gold Accounts</option>
            <option value="non-gold">Non Gold Accounts</option>
          </select>
          <select className="form-control w-25" value={entriesPerPage} onChange={handleEntriesPerPageChange}>
            <option value={10}>10 entries</option>
            <option value={20}>20 entries</option>
            <option value={50}>50 entries</option>
          </select>
        </div>
        {/* User Table */}
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("username")}>
                  Username {sortColumn === "username" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("firstname")}>
                  Name {sortColumn === "firstname" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("email")}>
                  Email {sortColumn === "email" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("phone")}>
                  Phone {sortColumn === "phone" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("country")}>
                  Country {sortColumn === "country" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.firstname} {user.lastname}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.country}</td>
                  <td>
                    <button className="btn btn-link p-0" onClick={() => handleToggleStatus(user.id)}
                      title={user.status === "1" ? "Deactivate User" : "Activate User"}>
                      {user.status === "1"
                        ? <Icons.Active className="text-success" size={20} />
                        : <Icons.Inactive className="text-danger" size={20} />}
                    </button>
                  </td>
                  <td>
                    <button className="btn btn-primary btn-sm"
                      onClick={() => router.push(`/admin/users/edit?id=${user.id}`)}>
                      <Icons.Edit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <PaginationAdmin
          currentPage={currentPage}
          totalPages={totalPages}
          goToPreviousPage={goToPreviousPage}
          goToNextPage={goToNextPage}
          goToFirstPage={goToFirstPage}
          goToLastPage={goToLastPage}
          dispatchCurrentPage={handlePageChange}
        />
        <div style={{ marginTop: 10, color: "#888" }}>
          <div>First page first user id: <b>{firstPageFirstId}</b></div>
          <div>Last page last user id: <b>{lastPageLastId}</b></div>
          <div>Stack pages cached: {pageStack.map(p => p.page).join(', ')}</div>
        </div>
      </div>
    </section>
  );
};

export default UserTable;
