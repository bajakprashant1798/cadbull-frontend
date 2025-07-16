import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getUsersByRoleApi, toggleUserStatusApi } from "@/service/api";
import PaginationAdmin from "@/components/PaginationAdmin";
import { useRouter } from "next/router";
import Icons from "@/components/Icons";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";
import { useCallback } from "react";

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
  const [lastPageFlag, setLastPageFlag] = useState(false);
  const [afterId, setAfterId] = useState(null); // For reverse pagination
  const [isReverse, setIsReverse] = useState(false); // Track reverse mode



  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => {
    // Set state to trigger API with last=true
    // setCurrentPage(totalPages);
    setLastPageFlag(true);
  };
  // Fetch users from API (pagination & filtering in backend)
 const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

const [beforeId, setBeforeId] = useState(null);
const [isSeek, setIsSeek] = useState(false);


useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500);
  return () => clearTimeout(handler);
}, [searchTerm]);


useEffect(() => {
  const params = {
    role,
    search: debouncedSearchTerm,
    status: filterStatus,
    perPage: entriesPerPage,
    sortColumn,
    sortOrder
  };

  if (lastPageFlag) {
    params.last = true;
  } else if (isSeek && beforeId) {
    params.seek = true;
    params.beforeId = beforeId;
  } else if (isReverse && afterId) {
    params.reverse = true;
    params.afterId = afterId;
  } else if (!isSeek && !isReverse && !lastPageFlag && currentPage !== null) {
    params.page = currentPage; // ✅ only if not in keyset mode
  }



  getUsersByRoleApi(params).then(res => {
    const firstUser = res.data.users[0];
    const lastUser = res.data.users[res.data.users.length - 1];

    setUsers(res.data.users);
    setTotalPages(res.data.totalPages);

    if (!isSeek && !isReverse && !lastPageFlag && res.data.currentPage) {
      setCurrentPage(res.data.currentPage);
    }

    // ✅ Reset all modes
    setLastPageFlag(false);
    setIsSeek(false);
    setIsReverse(false);

    setBeforeId(firstUser?.id || null);
    setAfterId(lastUser?.id || null);
  });
}, [
  isAuthenticated,
  role,
  debouncedSearchTerm,
  filterStatus,
  currentPage,
  entriesPerPage,
  sortColumn,
  sortOrder,
  lastPageFlag,
  beforeId,
  isReverse // ✅ ADD THIS
]);





  // Filter for gold/non-gold (frontend only)
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
    setCurrentPage(1); // Reset to first page on sort change
  };

  // Status toggle with re-fetch
  const handleToggleStatus = async (id) => {
    try {
      await toggleUserStatusApi(id);
      toast.success("User status updated successfully! ✅");
      // Re-fetch users
      getUsersByRoleApi(
        role, searchTerm, filterStatus, currentPage, entriesPerPage, sortColumn, sortOrder
      ).then((res) => {
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages);
      });
    } catch (error) {
      toast.error("Failed to update user status. ❌");
    }
  };

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => {
    setLastPageFlag(true);           // 👈 triggers keyset last page
    setCurrentPage(null);           // ✅ prevents offset query
    setIsSeek(false);
    setIsReverse(false);
    setBeforeId(null);
    setAfterId(null);
  };


  const goToPreviousPage = () => {
    if (lastPageFlag || isSeek) {
      setIsReverse(true);
      setIsSeek(false);
      setLastPageFlag(false);
      setCurrentPage(null); // ✅ important: prevent offset query for 260642
    } else {
      setCurrentPage((prev) => Math.max(1, prev - 1));
    }
  };


  const goToNextPage = () => {
    if (isReverse) {
      setIsReverse(false);
      setIsSeek(true);
    } else {
      setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    }
  };



  // Change entries per page resets to first page
  const handleEntriesPerPageChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
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
            onChange={(e) => { 
              setSearchTerm(e.target.value);
              setCurrentPage(1);
              setIsSeek(false);
              setIsReverse(false);
              setLastPageFlag(false);
              setBeforeId(null);
              setAfterId(null);
             }}
          />
          <select className="form-control w-25" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}>
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
          goToPreviousPage={goToPreviousPage} // ✅ use your keyset-aware version
          goToNextPage={goToNextPage}         // ✅ use your keyset-aware version
          goToFirstPage={handleFirstPage}
          goToLastPage={handleLastPage}
          dispatchCurrentPage={setCurrentPage}
        />

      </div>
    </section>
  );
};

export default UserTable;
