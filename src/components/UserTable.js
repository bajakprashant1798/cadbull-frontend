import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { getUsersByRoleApi, toggleUserStatusApi } from "@/service/api";
import PaginationAdmin from "@/components/PaginationAdmin";
import { useRouter } from "next/router";
import Icons from "@/components/Icons";
import { toast } from "react-toastify";

function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

const UserTable = ({ role, title }) => {
  const isAuthenticated = useSelector((store) => store.logininfo.isAuthenticated);

  // Pagination state
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [goldFilter, setGoldFilter] = useState("all");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortColumn, setSortColumn] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [afterId, setAfterId] = useState(null);
  const [beforeId, setBeforeId] = useState(null);

  const router = useRouter();

  // Debounce search input
  const debouncedSet = useRef(
    debounce((val) => setDebouncedSearch(val), 400)
  ).current;

  useEffect(() => {
    debouncedSet(searchTerm);
  }, [searchTerm, debouncedSet]);

  // Fetch users
  useEffect(() => {
    if (!isAuthenticated) return;

    let params = {
      role,
      search: debouncedSearch,
      status: filterStatus,
      perPage: entriesPerPage,
      sortColumn,
      sortOrder,
    };

    if (afterId) params.afterId = afterId;
    else if (beforeId) params.beforeId = beforeId;
    else params.page = currentPage;

    getUsersByRoleApi(params)
      .then(res => {
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages);
        setCurrentPage(res.data.currentPage || currentPage);
        // Reset keyset after fetch
        setAfterId(null);
        setBeforeId(null);
      });
  }, [
    isAuthenticated, role, debouncedSearch, filterStatus, currentPage,
    entriesPerPage, sortColumn, sortOrder, afterId, beforeId
  ]);

  // Gold/non-gold filter (frontend only)
  const filteredUsers = users.filter((user) => {
    if (goldFilter === "all") return true;
    if (!user.acc_exp_date) return goldFilter === "non-gold";
    const expDate = new Date(user.acc_exp_date);
    const today = new Date();
    return goldFilter === "gold" ? expDate > today : expDate <= today;
  });

  // Sorting handler
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
    setCurrentPage(1);
    setAfterId(null); setBeforeId(null);
  };

  // Status toggle with re-fetch
  const handleToggleStatus = async (id) => {
    try {
      await toggleUserStatusApi(id);
      toast.success("User status updated successfully! ✅");
      // Re-fetch users
      getUsersByRoleApi({
        role, search: debouncedSearch, status: filterStatus,
        page: currentPage, perPage: entriesPerPage,
        sortColumn, sortOrder
      }).then((res) => {
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages);
      });
    } catch (error) {
      toast.error("Failed to update user status. ❌");
    }
  };

  // Pagination Handlers
  const goToFirstPage = () => { setCurrentPage(1); setAfterId(null); setBeforeId(null); };
  const goToLastPage = () => { setCurrentPage(totalPages); setAfterId(null); setBeforeId(null); };
  const goToPage = (pageNum) => { setCurrentPage(pageNum); setAfterId(null); setBeforeId(null); };

  const goToNextPage = () => {
    if (users.length > 0) setAfterId(users[users.length - 1].id);
  };
  const goToPreviousPage = () => {
    if (users.length > 0) setBeforeId(users[0].id);
  };

  const handleEntriesPerPageChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
    setAfterId(null);
    setBeforeId(null);
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
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); setAfterId(null); setBeforeId(null); }}
          />
          <select className="form-control w-25" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); setAfterId(null); setBeforeId(null); }}>
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
          dispatchCurrentPage={goToPage}
        />
      </div>
    </section>
  );
};

export default UserTable;
