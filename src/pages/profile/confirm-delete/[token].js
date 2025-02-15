import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { confirmAccountDeletion } from "@/service/api";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

const ConfirmDelete = () => {
  const router = useRouter();
  const { token } = router.query;
  const dispatch = useDispatch(); // ✅ Add Redux Dispatch
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    confirmAccountDeletion(token)
      .then((res) => {
        toast.success("Your account has been deleted.");

        // ✅ Dispatch Redux Logout
        dispatch(logout());

        // ✅ Clear Local Storage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userData");

        // ✅ Trigger Full Page Reload (Ensure Header Update)
        setTimeout(() => {
          window.location.reload(); // Force page reload to update header
          router.push("/auth/login");
        }, 1500);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Invalid or expired token.");
        setTimeout(() => router.push("/"), 2000);
      })
      .finally(() => setLoading(false));
  }, [token, dispatch, router]);

  return (
    <div className="container text-center mt-5">
      {loading ? <p>Processing your request...</p> : <p>Redirecting...</p>}
    </div>
  );
};

export default ConfirmDelete;
