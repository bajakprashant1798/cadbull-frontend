import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import AdminLayout from "@/layouts/AdminLayout";

const Dashboard = () => {
//   const router = useRouter();
//   const user = useSelector((store) => store.logininfo.user);

//   useEffect(() => {
//     if (!user || user.role !== 1) {
//       router.push("/"); // Redirect non-admins to homepage
//     }
//   }, [user, router]);

//   if (!user || user.role !== 1) return null;

  return (
    <AdminLayout>
      <h1 className="fw-bold">Welcome, Admin!</h1>
      <p>Manage users, Categories, and Fiels here.</p>
    </AdminLayout>
  );
};

export default Dashboard;

