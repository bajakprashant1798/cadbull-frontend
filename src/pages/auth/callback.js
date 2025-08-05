"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../redux/app/features/authSlice";
import { toast } from "react-toastify";
import { redirectAfterLogin } from "@/utils/redirectHelpers";

const OAuthCallback = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get("user");
    const redirectParam = urlParams.get("redirect");
  
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
              userData: userData,
              redirect: redirectParam
            }, window.location.origin);
            window.close();
          } catch (error) {
            // If postMessage fails, redirect parent window
            const redirectUrl = redirectParam && redirectParam !== '/auth/login' 
              ? decodeURIComponent(redirectParam)
              : (userData.role === 1 ? "/admin/dashboard" : "/");
            window.opener.location.href = redirectUrl;
            window.close();
          }
        } else {
          // Normal redirect flow - use helper function
          setTimeout(() => {
            // If we have a redirect parameter, add it to the router query
            if (redirectParam) {
              router.query.redirect = redirectParam;
            }
            redirectAfterLogin(router, userData);
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
