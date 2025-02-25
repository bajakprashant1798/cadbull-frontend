import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getSubscribersApi, deleteSubscriberApi } from "@/service/api";
import { useRouter } from "next/router";
import { Edit, Trash } from "lucide-react";
import PaginationAdmin from "@/components/PaginationAdmin";
import { toast } from "react-toastify";
import AdminLayout from "@/layouts/AdminLayout";

const ListSubscribers = () => {
  const { token } = useSelector((store) => store.logininfo);
  const [subscribers, setSubscribers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      fetchSubscribers();
    }
  }, [searchTerm, currentPage, entriesPerPage, token]);

  const fetchSubscribers = async () => {
    try {
      const res = await getSubscribersApi(searchTerm, currentPage, entriesPerPage, token);
      setSubscribers(res.data.subscribers);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      toast.error("Error fetching subscribers");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this subscriber?")) return;
    try {
      await deleteSubscriberApi(id, token);
      toast.success("Subscriber deleted successfully");
      fetchSubscribers();
    } catch (error) {
      toast.error("Error deleting subscriber");
    }
  };

  return (
    <AdminLayout>
      <div className="container py-5">
        <h2>List of Subscribers</h2>

        {/* Search & Entries Filter */}
        <div className="d-flex justify-content-between mb-3">
          <input
            type="text"
            className="form-control w-25"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-control w-25"
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(parseInt(e.target.value))}
          >
            <option value="10">10 entries</option>
            <option value="20">20 entries</option>
            <option value="50">50 entries</option>
          </select>
        </div>

        {/* Subscriber Table */}
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.length > 0 ? (
                subscribers.map((sub) => (
                  <tr key={sub.id}>
                    <td>{sub.name}</td>
                    <td>{sub.email}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => router.push(`/admin/newsletters/edit-subscriber?id=${sub.id}`)}
                      >
                        <Edit />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(sub.id)}>
                        <Trash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No subscribers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <PaginationAdmin
          currentPage={currentPage}
          totalPages={totalPages}
          goToPreviousPage={() => setCurrentPage(Math.max(1, currentPage - 1))}
          goToNextPage={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          dispatchCurrentPage={setCurrentPage}
        />
      </div>
    </AdminLayout>
  );
};

export default ListSubscribers;
