import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { getUsersByRoleApi, toggleUserStatusApi } from "@/service/api";
import PaginationAdmin from "@/components/PaginationAdmin";
import { useRouter } from "next/router";
import Icons from "@/components/Icons";
import { toast } from "react-toastify";

const MAX_OFFSET_PAGES = 100;

const UserTable = ({ role, title }) => {
  const isAuthenticated = useSelector((store) => store.logininfo.isAuthenticated);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [goldFilter, setGoldFilter] = useState("all");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);

  // Keyset Pagination State
  const [afterId, setAfterId] = useState(null);
  const [beforeId, setBeforeId] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [lastPageMode, setLastPageMode] = useState(false);

  const [deepPage, setDeepPage] = useState(null);


  const router = useRouter();

  // Debounce for search
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };
  const debouncedSearch = useCallback(debounce((val) => setSearchTerm(val), 500), []);

  const logPageState = (action, res, params) => {
    console.log(
      `[${action}] Users:`, (res.data.users || []).map(u => u.id),
      '| afterId:', res.data.nextId,
      '| beforeId:', res.data.prevId,
      '| deepPage:', deepPage,
      '| currentPage:', currentPage,
      '| lastPageMode:', lastPageMode,
      '| hasNext:', res.data.hasNext,
      '| hasPrev:', res.data.hasPrev,
      '| params:', params
    );
  };

  // --- Handler for "Last Page" button (fetch oldest users, reverse keyset) ---
  const goToLastPage = async () => {
    try {
      const params = buildParams();
      params.last = true;
      const res = await getUsersByRoleApi(params);
      setLastPageMode(true);
      setUsers(res.data.users || []);
      setAfterId(res.data.nextId || null);
      setBeforeId(res.data.prevId || null);
      setHasNext(!!res.data.hasNext);
      setHasPrev(!!res.data.hasPrev);
      setCurrentPage(res.data.totalPages || 1);
      setTotalPages(res.data.totalPages || 1);
      setDeepPage(res.data.totalPages || 1); // start at the real last page


      logPageState('NEXT_FROM_LAST', res, params);
    } catch (err) {
      toast.error("Failed to load users ❌");
    }
  };


  // For numbered page jump (offset mode only)
  const handlePageJump = async (pageNum) => {
    setLastPageMode(false);
    setCurrentPage(pageNum);
    setAfterId(null);
    setBeforeId(null);
    setHasNext(false);
    setHasPrev(pageNum > 1);

    const params = buildParams(null, pageNum);   // <-- Add this line!
    const res = await getUsersByRoleApi(params); // Use it here too
    setUsers(res.data.users || []);
    setAfterId(res.data.nextId || null);
    setBeforeId(res.data.prevId || null);
    setHasNext(!!res.data.hasNext);
    setTotalPages(res.data.totalPages || 1);

    logPageState('NEXT_FROM_LAST', res, params); // Now params is defined
  };

  // Next from last-page mode (move toward oldest users)
  const fetchNextFromLast = async (cursorAfterId) => {
    if (!lastPageMode || !cursorAfterId) return;
    const params = buildParams();
    params.last = true;
    params.afterId = cursorAfterId;
    const res = await getUsersByRoleApi(params);
    if (res.data.users?.length) {
      setUsers(res.data.users);
      setAfterId(res.data.nextId || null);
      setBeforeId(res.data.prevId || null);
      setHasNext(!!res.data.hasNext);
      setHasPrev(!!res.data.hasPrev);
      setDeepPage(prev => (prev !== null ? prev : (totalPages || 1)) + 1);
      setCurrentPage(prev => (prev !== null ? prev : (totalPages || 1)) + 1);
    }
    logPageState('NEXT_FROM_LAST', res, params);
  };




  // Handler for "First Page" button (reset to first/offset page 1)
  const goToFirstPage = async () => {
    setCurrentPage(1);
    setLastPageMode(false);
    setAfterId(null);
    setBeforeId(null);
    setHasNext(false);
    setHasPrev(false);
    setDeepPage(null);
    const res = await getUsersByRoleApi(buildParams(null, 1));
    setUsers(res.data.users || []);
    setAfterId(res.data.nextId || null);
    setBeforeId(res.data.prevId || null);
    setHasNext(!!res.data.hasNext);
    setHasPrev(false);
    setTotalPages(res.data.totalPages || 1);

    logPageState('NEXT_FROM_LAST', res, params);
  };

  // Then, for "Previous" from last page, do:
  const fetchPrevFromLast = async (cursorBeforeId) => {
    if (!lastPageMode || !cursorBeforeId) return;
    const params = buildParams();
    params.last = true;
    params.beforeId = cursorBeforeId;
    const res = await getUsersByRoleApi(params);
    if (res.data.users?.length) {
      setUsers(res.data.users);
      setAfterId(res.data.nextId || null);
      setBeforeId(res.data.prevId || null);
      setHasNext(!!res.data.hasNext);
      setHasPrev(!!res.data.hasPrev);
      setDeepPage(prev => (prev !== null ? prev : (totalPages || 1)) - 1);
      setCurrentPage(prev => (prev !== null ? prev : (totalPages || 1)) - 1);
    }
    logPageState('NEXT_FROM_LAST', res, params);
  };
    


  // Build API params
  const buildParams = (direction = null, pageOverride = null) => {
    let params = {
      role,
      emailSearch: searchTerm.trim(),
      status: filterStatus,
      perPage: entriesPerPage,
      sortColumn,
      sortOrder,
      gold: goldFilter !== "all" ? goldFilter : undefined,
    };
    // Offset mode
    if ((pageOverride || currentPage) <= MAX_OFFSET_PAGES) params.page = pageOverride || currentPage;
    // Keyset for deep pages
    if ((pageOverride || currentPage) > MAX_OFFSET_PAGES) {
      if (direction === "next" && afterId) params.afterId = afterId;
      if (direction === "prev" && beforeId) params.beforeId = beforeId;
    }
    return params;
  };

  // Fetch initial data or when filter changes (reset all keyset state!)
  useEffect(() => {
    setCurrentPage(1);
    setAfterId(null);
    setBeforeId(null);
    setHasNext(false);
    setHasPrev(false);

    const fetchData = async () => {
      try {
        const res = await getUsersByRoleApi(buildParams(null, 1));
        setUsers(res.data.users || []);
        setAfterId(res.data.nextId || null);
        setBeforeId(res.data.prevId || null);
        setHasNext(!!res.data.hasNext);
        setHasPrev(false); // on first page, no prev
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        setUsers([]);
        toast.error("Failed to load users ❌");
      }
    };
    if (isAuthenticated) fetchData();
  }, [role, filterStatus, goldFilter, searchTerm, entriesPerPage, sortColumn, sortOrder, isAuthenticated]);

  // Fetch next/prev page
  const fetchUserPage = async (direction) => {
    try {
      let nextPage = currentPage;
      if (direction === "next") nextPage = currentPage + 1;
      if (direction === "prev") nextPage = currentPage - 1;
      let params = buildParams(direction, nextPage);
      const res = await getUsersByRoleApi(params);
      setLastPageMode(false);
      setUsers(res.data.users || []);
      setAfterId(res.data.nextId || null);
      setBeforeId(res.data.prevId || null);
      setHasNext(!!res.data.hasNext);
      setHasPrev(direction === "next" || hasPrev || !!beforeId || nextPage > 1);
      setCurrentPage(nextPage);
      if (res.data.totalPages) setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error("Failed to load users ❌");
    }
  };

  // Handlers
  const handleSort = (column) => {
    if (sortColumn === column) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortColumn(column); setSortOrder("asc"); }
  };
  const handleToggleStatus = async (id) => {
    try {
      await toggleUserStatusApi(id);
      toast.success("User status updated successfully! ✅");
      fetchUserPage(); // reload this page
    } catch {
      toast.error("Failed to update user status ❌");
    }
  };
  const handleEntriesPerPageChange = (e) => setEntriesPerPage(Number(e.target.value));
  const handleSearchChange = (e) => debouncedSearch(e.target.value);

  // Only show page numbers for offset pages
  // const showNumbers = !lastPageMode && currentPage <= MAX_OFFSET_PAGES;
  const showNumbers = !lastPageMode;


  return (
    <section className="py-lg-5 py-4 profile-page">
      <div className="container">
        <h2 className="mb-4">{title}</h2>
        {/* Filters */}
        <div className="d-flex justify-content-between mb-3">
          <input type="text" className="form-control w-25" placeholder="Search by email..." onChange={handleSearchChange} />
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
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("username")}>Username {sortColumn === "username" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("firstname")}>Name {sortColumn === "firstname" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("email")}>Email {sortColumn === "email" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("phone")}>Phone {sortColumn === "phone" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("country")}>Country {sortColumn === "country" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</th>
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
          currentPage={lastPageMode ? (deepPage || totalPages) : currentPage}
          totalPages={showNumbers ? totalPages : null}
          goToFirstPage={goToFirstPage}
          goToLastPage={goToLastPage}
          goToPreviousPage={lastPageMode
            ? () => fetchPrevFromLast(users.length ? users[0].id : beforeId)
            : () => hasPrev && fetchUserPage("prev")
          }
          goToNextPage={lastPageMode
            ? () => fetchNextFromLast(users.length ? users[users.length - 1].id : afterId)
            : () => hasNext && fetchUserPage("next")
          }
          dispatchCurrentPage={showNumbers ? handlePageJump : undefined}
        />

        {!showNumbers && (
          <div className="text-center mt-2" style={{color: "#888"}}>
            <b>Deep pagination mode: use Next/Previous</b>
          </div>
        )}
      </div>
    </section>
  );
};

export default UserTable;
