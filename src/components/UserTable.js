import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getUsersByRoleApi, toggleUserStatusApi } from "@/service/api"; // Import toggleUserStatus API
import PaginationAdmin from "@/components/PaginationAdmin";
import { useRouter } from "next/router";
import Icons from "@/components/Icons";
import { toast } from "react-toastify";

const UserTable = ({ role, title }) => {
  const { token } = useSelector((store) => store.logininfo);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // Store filtered users
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState(""); // Active or Inactive
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  // ✅ Sorting State
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [role, filterStatus, currentPage, entriesPerPage, token]);

  const fetchUsers = () => {
    getUsersByRoleApi(role, "", filterStatus, currentPage, entriesPerPage, token)
      .then((res) => {
        setUsers(res.data.users);
        setFilteredUsers(res.data.users); // ✅ Initialize filtered users for search
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => console.error("Error fetching users:", err));
  };

  const handlePageChange = (newPage) => setCurrentPage(newPage);

  // ✅ Handle Sorting Logic
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortColumn) return 0;

    let valueA = a[sortColumn];
    let valueB = b[sortColumn];

    // Handle undefined or null values
    if (valueA == null) valueA = "";
    if (valueB == null) valueB = "";

    if (typeof valueA === "string") {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
    if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // ✅ Search Functionality (Search by Email)
  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users); // Reset filter if search is empty
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      const filtered = users.filter(
        (user) => user.email.toLowerCase().includes(lowerSearch) // 🔥 Only search by email
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // ✅ Toggle User Status (Activate/Deactivate)
  const handleToggleStatus = async (id) => {
    try {
      const res = await toggleUserStatusApi(id, token);
      toast.success("User status updated successfully! ✅");

      // ✅ Update the users list dynamically after status change
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
          <select className="form-control w-25" onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
          <select className="form-control w-25" onChange={(e) => setEntriesPerPage(e.target.value)}>
            <option value="10">10 entries</option>
            <option value="20">20 entries</option>
            <option value="50">50 entries</option>
          </select>
        </div>

        {/* User Table */}
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th onClick={() => handleSort("username")} style={{ cursor: "pointer" }}>
                  Username {sortColumn === "username" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th onClick={() => handleSort("firstname")} style={{ cursor: "pointer" }}>
                  Name {sortColumn === "firstname" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>
                  Email {sortColumn === "email" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th onClick={() => handleSort("phone")} style={{ cursor: "pointer" }}>
                  Phone {sortColumn === "phone" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th onClick={() => handleSort("country")} style={{ cursor: "pointer" }}>
                  Country {sortColumn === "country" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.firstname} {user.lastname}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.country}</td>
                  <td>
                    {/* ✅ Clickable Icon to Toggle Status */}
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
                    <button className="btn btn-primary btn-sm" onClick={() => router.push(`/admin/users/edit?id=${user.id}`)}>
                      <Icons.Edit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
