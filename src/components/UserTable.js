import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { getUsersByRoleApi, toggleUserStatusApi } from "@/service/api";
import PaginationAdmin from "@/components/PaginationAdmin";
import { useRouter } from "next/router";
import Icons from "@/components/Icons";
import { toast } from "react-toastify";

const MAX_STACK_SIZE = 5; // Number of pages to cache in stack

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

  // Stack/cache for paging: [{page, users, beforeId, afterId}]
  const [pageStack, setPageStack] = useState([]);
  const [firstPageFirstId, setFirstPageFirstId] = useState(null);
  const [lastPageLastId, setLastPageLastId] = useState(null);

  // Refs to avoid stale closures in async
  const stackRef = useRef(pageStack);
  stackRef.current = pageStack;
  const currentPageRef = useRef(currentPage);
  currentPageRef.current = currentPage;

  // Build API params utility
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

  // Fill stack and store first/last user id on initial load or filter/sort change
  useEffect(() => {
    let isMounted = true;
    async function fetchInitialPages() {
      let newStack = [];
      let firstId = null, lastId = null;
      let totalFetchedPages = 0;
      let newTotalPages = 1;

      // 1. Fetch first N pages in sequence (no parallel to avoid race)
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
      // 2. Fetch last page to get last user id
      const lastParams = buildParams(newTotalPages);
      lastParams.page = newTotalPages;
      const lastRes = await getUsersByRoleApi(lastParams);
      lastId = lastRes.data.users[lastRes.data.users.length - 1]?.id || null;

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
    // Cleanup on unmount or filter change
    return () => { isMounted = false; };
    // Trigger on these dependencies:
  }, [role, filterStatus, goldFilter, searchTerm, entriesPerPage, sortColumn, sortOrder, isAuthenticated]);

  // Helper to get cached page
  function getCachedPage(pageNum) {
    return stackRef.current.find(p => p.page === pageNum);
  }

  // Handler for next/prev/first/last/page number
  const handlePageChange = async (pageNum) => {
    // If in stack, use cache
    const cached = getCachedPage(pageNum);
    if (cached) {
      setUsers(cached.users);
      setCurrentPage(pageNum);
    } else {
      // Fetch and update stack
      const res = await getUsersByRoleApi(buildParams(pageNum));
      const usersData = res.data.users;
      setUsers(usersData);
      setCurrentPage(pageNum);
      // Add to stack, maintain at MAX_STACK_SIZE
      let newStack = [...stackRef.current, {
        page: pageNum,
        users: usersData,
        beforeId: usersData[0]?.id,
        afterId: usersData[usersData.length - 1]?.id,
      }];
      // Keep stack sliding window
      if (newStack.length > MAX_STACK_SIZE) newStack.shift();
      setPageStack(newStack);
    }
  };

  const goToFirstPage = () => handlePageChange(1);

  const goToLastPage = () => handlePageChange(totalPages);

  const goToPreviousPage = () => {
    if (currentPage > 1) handlePageChange(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) handlePageChange(currentPage + 1);
  };

  // Filter for gold/non-gold (frontend only, but backend does SQL filter too)
  const filteredUsers = users; // No additional frontend filtering needed, since backend does gold now

  // Sorting handler
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
    // Triggers useEffect to refetch
  };

  // Status toggle
  const handleToggleStatus = async (id) => {
    try {
      await toggleUserStatusApi(id);
      toast.success("User status updated successfully! ✅");
      handlePageChange(currentPage);
    } catch (error) {
      toast.error("Failed to update user status. ❌");
    }
  };

  // Search debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

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
            type="text"
            className="form-control w-25"
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select className="form-control w-25" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
          <select className="form-control w-25" value={goldFilter} onChange={(e) => setGoldFilter(e.target.value)}>
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
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.firstname} {user.lastname}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.country}</td>
                  <td>
                    <button className="btn btn-link p-0" onClick={() => handleToggleStatus(user.id)}
                      title={user.status === "1" ? "Deactivate User" : "Activate User"}>
                      {user.status === "1" ?
                        <Icons.Active className="text-success" size={20} />
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

        {/* For debugging: show first and last id */}
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
