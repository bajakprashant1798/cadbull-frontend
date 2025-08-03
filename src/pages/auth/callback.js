"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../redux/app/features/authSlice";
import { toast } from "react-toastify";

const OAuthCallback = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get("user");
  
    if (userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        
        // Store user data
        localStorage.setItem("userData", JSON.stringify(userData));
        dispatch(loginSuccess({ user: userData, status: "authenticated" }));
        window.dispatchEvent(new Event("userLoggedIn"));
  
        // Check if we're in a popup (for Safari compatibility)
        if (window.opener && !window.opener.closed) {
          // We're in a popup - send data to parent and close
          try {
            window.opener.postMessage({
              type: 'SOCIAL_LOGIN_SUCCESS',
              userData: userData
            }, window.location.origin);
            window.close();
          } catch (error) {
            // If postMessage fails, redirect parent window
            window.opener.location.href = userData.role === 1 ? "/admin/dashboard" : "/";
            window.close();
          }
        } else {
          // Normal redirect flow
          setTimeout(() => {
            if (userData.role === 1) {
              router.replace("/admin/dashboard");
            } else if (userData.role === 5) {
              router.replace("/admin/dashboard");
            } else {
              router.replace("/");
            }
          }, 500);
        }
      } catch (error) {
        console.error("❌ Failed to parse user data:", error);
        toast.error("Failed to retrieve user details.");
        
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({
            type: 'SOCIAL_LOGIN_ERROR',
            error: 'Failed to parse user data'
          }, window.location.origin);
          window.close();
        } else {
          router.replace("/auth/login");
        }
      }
    } else {
      console.error("❌ No user data found in URL.");
      toast.error("Failed to retrieve user details.");
      router.replace("/auth/login");
    }
  }, [router, dispatch]);
  

  return <p>Processing login...</p>;
};

export default OAuthCallback;
