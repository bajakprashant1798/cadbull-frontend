import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { logout } from "../../../redux/app/features/authSlice"
import profileIcon from "@/assets/icons/profile.png";
import { resetProjectState } from "../../../redux/app/features/projectsSlice";
import { logoutApiHandler } from "@/service/api";

const AdminHeader = () => {
  const { user } = useSelector((store) => store.logininfo);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Optionally call the logout API to clear cookies on the backend
      await logoutApiHandler();
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Clear any non-sensitive user data stored in localStorage if used for rehydration
      localStorage.removeItem("userData");
      // Dispatch logout to clear Redux state
      dispatch(logout());
      dispatch(resetProjectState());
      // Redirect to login page
      router.replace("/auth/login");
      // As a fallback, force a full page reload after a short delay.
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 100);
    }
  };
  
  

  return (
    <nav className="admin-header d-flex justify-content-between align-items-center p-3 bg-white shadow">
      <h2 className="text-primary m-0">Admin Dashboard</h2>
      <div className="d-flex align-items-center gap-3">
        <span>{user?.firstname} {user?.lastname}</span>
        <Link href="/">
          <img src={user?.profile_pic || profileIcon.src} alt="profile" width="30" className="rounded-circle" />
        </Link>
        <button className="btn btn-danger btn-sm" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default AdminHeader;
