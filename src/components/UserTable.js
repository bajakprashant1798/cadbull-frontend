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
      search: searchTerm.trim(),
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
      let newStack = [];
      let firstId = null, lastId = null;
      let totalFetchedPages = 0;
      let newTotalPages = 1;

      // Fetch first MAX_STACK_SIZE pages
      for (let i = 1; i <= MAX_STACK_SIZE; i++) {
        const params = buildParams(i);
        const res = await getUsersByRoleApi(params);
        if (i === 1) {
          firstId = res.data.users[0]?.id || null;
          newTotalPages = res.data.totalPages;
        }
        if (res.data.users.length === 0) break;
        newStack.push({
          page: i,
          users: res.data.users,
          beforeId: res.data.users[0]?.id,
          afterId: res.data.users[res.data.users.length - 1]?.id,
        });
        totalFetchedPages++;
      }

      // Always fetch last page with last=true!
      // let lastId = null;
      if (newTotalPages > 1) {
        const lastRes = await getUsersByRoleApi({ ...buildParams(), last: true });
        lastId = lastRes.data.users[lastRes.data.users.length - 1]?.id || null;
      }

      if (isMounted) {
        setPageStack(newStack);
        setFirstPageFirstId(firstId);
        setLastPageLastId(lastId);
        setUsers(newStack[0]?.users || []);
        setCurrentPage(1);
        setTotalPages(newTotalPages);
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

  // Optimize handlePageChange to use fetchAndCachePage
  const handlePageChange = async (pageNum) => {
    try {
      const users = await fetchAndCachePage(pageNum);
      setUsers(users);
      setCurrentPage(pageNum);
    } catch (error) {
      toast.error("Failed to load users ❌");
      console.error(error);
    }
  };

  // Go to first page
  const goToFirstPage = () => handlePageChange(1);

  // Optimize goToLastPage function
  const goToLastPage = async () => {
    try {
      // Get total pages and last page data
      const totalRes = await getUsersByRoleApi({ 
        ...buildParams(),
        page: 1,
        perPage: 1
      });
      
      const lastPageNum = totalRes.data.totalPages;
      
      // Fetch last few pages for stack (MAX_STACK_SIZE)
      const startPage = Math.max(lastPageNum - MAX_STACK_SIZE + 1, 1);
      let newStack = [];

      // Get last page first to get lastUserId
      const lastRes = await getUsersByRoleApi({
        ...buildParams(),
        page: lastPageNum,
        last: true
      });

      if (lastRes.data.users?.length > 0) {
        const lastUserId = lastRes.data.users[0].id;
        
        // Fetch pages backwards from last page
        for (let i = lastPageNum; i >= startPage; i--) {
          const res = await getUsersByRoleApi({
            ...buildParams(),
            page: i,
            beforeId: lastUserId
          });
          
          if (res.data.users?.length > 0) {
            newStack.unshift({
              page: i,
              users: res.data.users,
              beforeId: res.data.users[0]?.id,
              afterId: res.data.users[res.data.users.length - 1]?.id
            });
          }
        }

        setPageStack(newStack);
        setUsers(lastRes.data.users);
        setCurrentPage(lastPageNum);
        setTotalPages(lastPageNum);
        setLastPageLastId(lastUserId);
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
    e.target.value = value; // Keep input value updated
    debouncedSearch(value);
  };

  return (
    <section className="py-lg-5 py-4 profile-page">
      <div className="container">
        <h2 className="mb-4">{title}</h2>
        {/* Search, Filter & Entries Selection */}
        <div className="d-flex justify-content-between mb-3">
          <input
            type="text"
            className="form-control w-25"
            placeholder="Search by email..."
            onChange={handleSearchChange}
            defaultValue={searchTerm} // Use defaultValue instead of value
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
