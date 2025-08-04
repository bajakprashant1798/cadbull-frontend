import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logout } from "../../redux/app/features/authSlice";
import AdminHeader from "@/components/common/AdminHeader";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/router";
import { resetProjectState } from "../../redux/app/features/projectsSlice";
import { getUserData } from "@/service/api";

const AdminLayout = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  // const { user, accessToken } = useSelector((store) => store.logininfo);
  const { isAuthenticated } = useSelector((store) => store.logininfo);

  // const { user } = useSelector((store) => store.logininfo.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Call your API to rehydrate user data using cookies
    getUserData({ withCredentials: true })
      .then((res) => {
        if (res.data && res.data.user) {
          dispatch(loginSuccess({ user: res.data.user, status: "authenticated" }));
        } else {
          dispatch(logout());
          router.push("/auth/login");
        }
      })
      .catch((error) => {
        console.error("Error rehydrating user data:", error);
        dispatch(logout());
        dispatch(resetProjectState());
        router.push("/auth/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch, router]);

  if (loading) return <p>Loading...</p>;

  // If not authenticated, redirect to login.
  if (!isAuthenticated) {
    router.push("/auth/login");
    return null;
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content">
        <AdminHeader />
        <main className="p-4 main-mt-0">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
