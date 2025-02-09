import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { verifyEmailApiHandler } from "@/service/api"; // API function to verify email
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const router = useRouter();
  const { token } = router.query;
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return; // Ensure token exists

    // ✅ Call the API to verify email
    verifyEmailApiHandler(token)
      .then((res) => {
        setMessage("✅ Email verified successfully! Redirecting...");
        toast.success("Email verified successfully!");
        setTimeout(() => router.push("/auth/login"), 3000);
      })
      .catch((err) => {
        setMessage("❌ Email verification failed or token expired.");
        toast.error("Email verification failed.");
      })
      .finally(() => setLoading(false));
  }, [token, router]);

  return (
    <div className="container text-center mt-5">
      <h2>Email Verification</h2>
      {loading ? <p>🔄 Verifying your email...</p> : <p>{message}</p>}
    </div>
  );
};

export default VerifyEmail;
