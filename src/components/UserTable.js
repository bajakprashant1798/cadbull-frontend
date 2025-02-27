import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getUsersByRoleApi, toggleUserStatusApi } from "@/service/api"; // Import your API calls
import PaginationAdmin from "@/components/PaginationAdmin";
import { useRouter } from "next/router";
import Icons from "@/components/Icons";
import { toast } from "react-toastify";

const UserTable = ({ role, title }) => {
  const { token } = useSelector((store) => store.logininfo);
  const [users, setUsers] = useState([]); // All users fetched from API
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState(""); // Active ("1") or Inactive ("0")
  const [goldFilter, setGoldFilter] = useState("all"); // "all", "gold", "non-gold"
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  // Sorting state
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'

  // Fetch users from API (fetch all users; if your API is paginated you may need to adjust this)
  useEffect(() => {
    if (token) {
      getUsersByRoleApi(role, "", filterStatus, 1, 1000, token)
        .then((res) => {
          // Assume res.data.users is an array of all users for the given role
          setUsers(res.data.users);
        })
        .catch((err) => console.error("Error fetching users:", err));
    }
  }, [role, filterStatus, token]);

  // Compute filtered users based on search term and gold subscription filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch = searchTerm
      ? user.email.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    // Gold filter: assume user.acc_exp_date is available (a string in a valid date format)
    let matchesGold = true;
    if (goldFilter !== "all") {
      if (!user.acc_exp_date) {
        matchesGold = goldFilter === "non-gold";
      } else {
        const expDate = new Date(user.acc_exp_date);
        const today = new Date();
        matchesGold = goldFilter === "gold" ? expDate > today : expDate <= today;
      }
    }

    return matchesSearch && matchesGold;
  });

  // Sorting: sort filtered users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortColumn) return 0;

    let valueA = a[sortColumn] ?? "";
    let valueB = b[sortColumn] ?? "";

    if (typeof valueA === "string") {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
    if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Compute total pages based on the length of the sorted (filtered) users array
  useEffect(() => {
    const pages = Math.ceil(sortedUsers.length / entriesPerPage) || 1;
    setTotalPages(pages);

    // If the current page is now beyond the new total pages, adjust it.
    if (currentPage > pages) {
      setCurrentPage(1);
    }
  }, [sortedUsers, entriesPerPage, currentPage]);

  // Compute the users to display on the current page (client-side pagination)
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  // Sorting handler
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  // Toggle user status handler
  const handleToggleStatus = async (id) => {
    try {
      await toggleUserStatusApi(id, token);
      toast.success("User status updated successfully! ✅");
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, status: user.status === "1" ? "0" : "1" } : user
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status. ❌");
    }
  };

  // Pagination handler
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
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
          <select
            className="form-control w-25"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
          <select
            className="form-control w-25"
            value={goldFilter}
            onChange={(e) => setGoldFilter(e.target.value)}
          >
            <option value="all">All Accounts</option>
            <option value="gold">Gold Accounts</option>
            <option value="non-gold">Non Gold Accounts</option>
          </select>
          <select
            className="form-control w-25"
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
          >
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
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("username")}
                >
                  Username {sortColumn === "username" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("firstname")}
                >
                  Name {sortColumn === "firstname" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("email")}
                >
                  Email {sortColumn === "email" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("phone")}
                >
                  Phone {sortColumn === "phone" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("country")}
                >
                  Country {sortColumn === "country" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.firstname} {user.lastname}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.country}</td>
                  <td>
                    <button
                      className="btn btn-link p-0"
                      onClick={() => handleToggleStatus(user.id)}
                      title={user.status === "1" ? "Deactivate User" : "Activate User"}
                    >
                      {user.status === "1" ? (
                        <Icons.Active className="text-success" size={20} />
                      ) : (
                        <Icons.Inactive className="text-danger" size={20} />
                      )}
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => router.push(`/admin/users/edit?id=${user.id}`)}
                    >
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
          goToPreviousPage={() => handlePageChange(currentPage - 1)}
          goToNextPage={() => handlePageChange(currentPage + 1)}
          dispatchCurrentPage={setCurrentPage}
        />
      </div>
    </section>
  );
};

export default UserTable;
