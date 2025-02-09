import { useState } from "react";
import { useSelector } from "react-redux";
import { changePasswordApi } from "@/service/api";
import { toast } from "react-toastify";
import AdminLayout from "@/layouts/AdminLayout";

const ChangePassword = () => {
  const { token } = useSelector((store) => store.logininfo);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Handle Password Change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }

    setLoading(true);
    try {
      await changePasswordApi({ currentPassword, newPassword }, token);
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.response?.data?.error || "Error changing password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container py-5">
        <h2>Change Password</h2>
        <form onSubmit={handlePasswordChange} className="mt-4">
          <div className="mb-3">
            <label>Current Password</label>
            <input
              type="password"
              className="form-control"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>New Password</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength="8"
            />
          </div>

          <div className="mb-3">
            <label>Confirm New Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ChangePassword;
