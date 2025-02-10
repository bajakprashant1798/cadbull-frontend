import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { getUsersEarningsApi } from "@/service/api";
import Pagination from "@/components/Pagination";
import { useRouter } from "next/router";
import Icons from "@/components/Icons";
import { toast } from "react-toastify";
import AdminLayout from "@/layouts/AdminLayout";
import { debounce } from "lodash"; // ✅ Import lodash debounce

const UsersEarning = () => {
  const { token } = useSelector((store) => store.logininfo);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  // ✅ UseCallback + Debounce: Prevent unnecessary API calls
  const fetchUsersEarnings = useCallback(
    debounce(() => {
      console.log("🔄 Fetching users earnings...");
      getUsersEarningsApi(filterStatus, currentPage, entriesPerPage, token)
        .then((res) => {
          setUsers(res.data.users);
          setFilteredUsers(res.data.users);
          setTotalPages(res.data.totalPages);
        })
        .catch((err) => console.error("❌ Error fetching users earnings:", err));
    }, 500), // ✅ Delay API call by 500ms
    [filterStatus, currentPage, entriesPerPage, token]
  );

  useEffect(() => {
    let isMounted = true;
    fetchUsersEarnings();
  
    return () => {
      isMounted = false; // Cleanup to avoid memory leaks
    };
  }, [fetchUsersEarnings]);
  

  const handlePageChange = (newPage) => setCurrentPage(newPage);

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
    let valueA = a[sortColumn] || "";
    let valueB = b[sortColumn] || "";
    if (typeof valueA === "string") {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }
    return valueA < valueB ? (sortOrder === "asc" ? -1 : 1) : valueA > valueB ? (sortOrder === "asc" ? 1 : -1) : 0;
  });

  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      const filtered = users.filter((user) => user.email.toLowerCase().includes(lowerSearch));
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  return (
    <AdminLayout>
      <section className="py-lg-5 py-4 profile-page">
        <div className="container">
          <h2 className="mb-4">Users Earnings</h2>

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

          {/* User Earnings Table */}
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th onClick={() => handleSort("id")}>ID</th>
                  <th onClick={() => handleSort("name")}>Name</th>
                  <th>PayPal ID</th>
                  <th onClick={() => handleSort("email")}>Email</th>
                  <th>Rupees</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.firstname} {user.lastname}</td>
                    <td>{user.paypal_id}</td>
                    <td>{user.email}</td>
                    <td>${user.rupees}</td>
                    <td>
                      <button className="btn btn-link p-0">
                        {user.status === "1" ? <Icons.Active className="text-success" size={20} /> : <Icons.Inactive className="text-danger" size={20} />}
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            goToPreviousPage={() => handlePageChange(currentPage - 1)}
            goToNextPage={() => handlePageChange(currentPage + 1)}
            dispatchCurrentPage={setCurrentPage}
          />
        </div>
      </section>
    </AdminLayout>
  );
};

export default UsersEarning;
