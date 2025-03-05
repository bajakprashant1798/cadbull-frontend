"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../redux/app/features/authSlice";
import { toast } from "react-toastify";
import { getUserData } from "@/service/api";

const OAuthCallback = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    // const accessToken = urlParams.get("accessToken");
    // const refreshToken = urlParams.get("refreshToken");
    const userParam = urlParams.get("user");
  
    // console.log("OAuth Callback Tokens:", accessToken, refreshToken);
  
    if (userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        console.log("✅ OAuth Callback User Data:", userData);
  
        // localStorage.setItem("accessToken", accessToken);
        // localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userData", JSON.stringify(userData));
  
        dispatch(loginSuccess({ user: userData,  status: "authenticated" }));
  
        window.dispatchEvent(new Event("userLoggedIn"));
  
        console.log("✅ User logged in:", userData);
  
        setTimeout(() => {
          if (userData.role === 1) {
            router.replace("/admin/dashboard");
          } else if (userData.role === 5) {
            router.replace("/admin/projects/view-project");
          } else {
            router.replace("/");
          }
        }, 500); // Small delay to ensure storage is updated
      } catch (error) {
        console.error("❌ Failed to parse user data:", error);
        toast.error("Failed to retrieve user details.");
        router.replace("/auth/login");
      }
    } else {
      console.error("❌ No token or user data found in URL.");
      toast.error("Failed to retrieve user details.");
      router.replace("/auth/login");
    }

    // // Instead of extracting tokens from the URL, we fetch the user data.
    // getUserData({ withCredentials: true })
    //   .then((res) => {
    //     // Use res.data directly (because getUserData returns the user object)
    //     const userData = res.data;
    //     console.log("Fetched user data:", userData);
    //     // Optionally store non-sensitive user info in localStorage
    //     localStorage.setItem("userData", JSON.stringify(userData));
    //     dispatch(loginSuccess({ user: userData, status: "authenticated" }));
    //     toast.success("Login successful!");
    //     // Redirect based on user role
    //     if (userData.role === 1) {
    //       router.replace("/admin/dashboard");
    //     } else if (userData.role === 5) {
    //       router.replace("/admin/projects/view-project");
    //     } else {
    //       router.replace("/");
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("❌ Failed to fetch user details:", error);
    //     toast.error("Failed to retrieve user details.");
    //     router.replace("/auth/login");
    //   });
  }, [router, dispatch]);
  

  return <p>Processing login...</p>;
};

export default OAuthCallback;
