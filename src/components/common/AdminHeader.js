import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { logout } from "../../../redux/app/features/authSlice"
import profileIcon from "@/assets/icons/profile.png";

const AdminHeader = () => {
  const { user, accessToken } = useSelector((store) => store.logininfo);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    dispatch(logout());
  
    // ✅ Clear session storage
    localStorage.removeItem("userData");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken")
    // ✅ Ensure proper redirection with Next.js router
    router.replace("/auth/login");
  
    // ✅ Hard reload fallback if router.replace doesn't work
    setTimeout(() => {
      window.location.href = "/auth/login";
    }, 100);
  };
  
  

  return (
    <header className="admin-header d-flex justify-content-between align-items-center p-3 bg-white shadow">
      <h2 className="text-primary m-0">Admin Dashboard</h2>
      <div className="d-flex align-items-center gap-3">
        <span>{user?.firstname} {user?.lastname}</span>
        <img src={user?.profile_pic || profileIcon.src} alt="profile" width="30" className="rounded-circle" />
        <button className="btn btn-danger btn-sm" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default AdminHeader;
