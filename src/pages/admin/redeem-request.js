import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getRedeemRequestsApi, toggleRedeemStatusApi } from "@/service/api";
import PaginationAdmin from "@/components/PaginationAdmin";
import { toast } from "react-toastify";
import AdminLayout from "@/layouts/AdminLayout";

const RedeemRequests = () => {
  // const { token } = useSelector((store) => store.logininfo);
  const isAuthenticated = useSelector((store) => store.logininfo.isAuthenticated);
  const [requests, setRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState(0); // Default: Payment Not Completed
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ Fetch Redeem Requests (With Debounce)
  useEffect(() => {
    const delayFetch = setTimeout(() => {
      if (isAuthenticated) {
        fetchRedeemRequests();
      }
    }, 500); // ⏳ Delay API call by 500ms

    return () => clearTimeout(delayFetch);
  }, [filterStatus, currentPage, entriesPerPage, isAuthenticated]);

  const fetchRedeemRequests = () => {
    getRedeemRequestsApi(filterStatus, currentPage, entriesPerPage)
      .then((res) => {
        setRequests(res.data.requests);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => console.error("❌ Error fetching redeem requests:", err));
  };

  const handleToggleRedeem = async (redeemId, userId, redeemMoney) => {
    try {
      const res = await toggleRedeemStatusApi(redeemId, userId, redeemMoney);
      const newStatus = res.data.newStatus;

      toast.success("✅ Redeem status updated successfully!");

      // ✅ Update UI Instantly
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.redeem_id === redeemId
            ? { ...req, is_redeem: newStatus, rupees: newStatus === 1 ? req.rupees - redeemMoney : req.rupees + redeemMoney }
            : req
        )
      );
    } catch (error) {
      console.error("❌ Error updating redeem status:", error);
      toast.error("Failed to update redeem status.");
    }
  };

  return (
    <AdminLayout>
      <section className="py-lg-5 py-4 profile-page">
        <div className="container">
          <h2 className="mb-4">Redeem Requests</h2>

          {/* ✅ Filter Options */}
          <div className="d-flex justify-content-between mb-3">
            <select
              className="form-control w-25"
              value={filterStatus}
              onChange={(e) => setFilterStatus(Number(e.target.value))}
            >
              <option value={0}>Payment Not Completed</option>
              <option value={1}>Payment Completed</option>
            </select>

            <select
              className="form-control w-25"
              onChange={(e) => setEntriesPerPage(e.target.value)}
            >
              <option value="10">10 entries</option>
              <option value="20">20 entries</option>
              <option value="50">50 entries</option>
            </select>
          </div>

          {/* ✅ Redeem Requests Table */}
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>PayPal ID</th>
                  <th>Email</th>
                  <th>Rupees</th>
                  <th>Redeem Points</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.redeem_id}>
                    <td>{req.id}</td>
                    <td>{req.firstname} {req.lastname}</td>
                    <td>{req.paypal_id}</td>
                    <td>{req.email}</td>
                    <td>${req.rupees}</td>
                    <td>{req.redeem_money}</td>
                    <td>
                      <button
                        className="btn btn-link p-0"
                        onClick={() => handleToggleRedeem(req.redeem_id, req.id, req.redeem_money)}
                      >
                        {req.is_redeem === 1 ? "✅ Completed" : "❌ Pending"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Pagination */}
          <PaginationAdmin
            currentPage={currentPage}
            totalPages={totalPages}
            goToPreviousPage={() => setCurrentPage(currentPage - 1)}
            goToNextPage={() => setCurrentPage(currentPage + 1)}
            dispatchCurrentPage={setCurrentPage}
          />
        </div>
      </section>
    </AdminLayout>
  );
};

export default RedeemRequests;
