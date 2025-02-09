import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../redux/app/features/authSlice";
import AdminHeader from "@/components/common/AdminHeader";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/router";

const AdminLayout = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, accessToken } = useSelector((store) => store.logininfo);
  
  // const { user } = useSelector((store) => store.logininfo.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read the token from sessionStorage using the correct key.
    const savedToken = localStorage.getItem("accessToken");
    // Your user data is stored as: JSON.stringify({ user: userData })
    const savedUserRaw = localStorage.getItem("userData");
    let savedUser = null;
    if (savedUserRaw) {
      const parsed = JSON.parse(savedUserRaw);
      savedUser = parsed.user || parsed;
    }
    if (savedToken && savedUser) {
      // Dispatch with a property named accessToken (not token)
      dispatch(
        loginSuccess({ user: savedUser, accessToken: savedToken, status: "authenticated" })
      );
    }
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      router.push("/auth/login"); // Redirect to login if no token found
    }
  }, [router, accessToken]);

  if (loading) return <p>Loading...</p>; // Prevents rendering before Redux loads

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content">
        <AdminHeader />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
