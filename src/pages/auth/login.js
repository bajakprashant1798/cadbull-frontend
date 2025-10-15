"use client";
import React from "react";
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import Icons from "@/components/Icons";
import Link from "next/link";
import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../../redux/app/features/authSlice";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import { loginApiHandler } from "@/service/api";
import useLoading from "@/utils/useLoading";
import { toast } from "react-toastify";
import { getFavouriteItems } from "@/service/api";
import { setFavouriteList } from "../../../redux/app/features/projectsSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import ReCAPTCHA from "react-google-recaptcha";
import { redirectAfterLogin } from "@/utils/redirectHelpers";
// import RecaptchaComponent from "@/components/RecaptchaComponent";


const pageTitle = {
  title: "Login to Your Account",
  description: (
    <>
      Cadbull is the world’s largest CAD library. Here, you can download over{" "}
      <span className="text-danger fw-bold">271,030+</span> premium and free CAD files. Create a free account and download 5 files per day for free. If you need to download more files, you can upgrade to our Gold Account plan and purchase additional access.
    </>
  ),
  // description:
  //   "Choose from 254195+ Free & Premium CAD Files with new additions published every second month",
};

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  // const { data: session } = useSession();
  const [isLoading,startLoading,stopLoading]=useLoading();
  // const isAuthenticated=useSessionStorageData('userData')

  //// Get isAuthenticated from Redux:
  const isAuthenticated = useSelector((state) => state.logininfo.isAuthenticated);
  const [showPassword, setShowPassword] = useState(false);

  const [captchaValue, setCaptchaValue] = useState(null);

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };



  // Immediately redirect if localStorage already has user data
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("userData")) {
      const userData = JSON.parse(localStorage.getItem("userData"));
      redirectAfterLogin(router, userData);
    }
  }, [router]);

  // Also, if Redux state is updated to "authenticated", redirect away from the login page
  useEffect(() => {
    if (isAuthenticated === true) {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      redirectAfterLogin(router, userData);
    }
  }, [isAuthenticated, router]);

  // Add error handling for OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get("error");
    
    if (errorParam) {
      // Decode the error message
      const errorMessage = decodeURIComponent(errorParam);
      toast.error(errorMessage);
      
      // Clean up the URL
      const url = new URL(window.location);
      url.searchParams.delete('error');
      window.history.replaceState({}, document.title, url.pathname);
    }
  }, []);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // Ensure the captcha is solved
    if (!captchaValue) {
      toast.error("Please verify that you are not a robot.");
      return;
    }
    
    // console.log('📝 Form Login - Router Query:', router.query);
    // console.log('📝 Form Login - Redirect URL:', router.query.redirect);
    // console.log('📝 Form Login - Full URL:', window.location.href);
    
    // Handle form submission here
    startLoading()
    // loginApiHandler(data)
    loginApiHandler({
      loginInput: data.loginInput,
      password: data.password,
      captcha: captchaValue,
    })

      .then((res) => {
        const { user } = res.data;

        if (!user) {
          toast.error("Login failed. Please try again.");
          return;
        }

        // console.log("user: login ", user);
        
        //// ✅ Store tokens in localStorage
        // localStorage.setItem("accessToken", accessToken);
        // localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userData", JSON.stringify(user));

        // dispatch(loginSuccess({ user, accessToken, status: "authenticated" }));

        dispatch(loginSuccess({ user, status: "authenticated" }));

        // Fetch and dispatch favorites after successful login:
        // if (accessToken) {
          getFavouriteItems()
            .then((favRes) => {
              dispatch(setFavouriteList(favRes.data.favorites || []));
              // console.log("res from getfav", favRes);
              
            })
            .catch((error) => {
              console.error("Error fetching favorites:", error);
            });
        // }

        // ✅ Trigger storage event to sync across tabs
        window.dispatchEvent(new Event("userLoggedIn"));

        stopLoading()

        // ✅ Use helper function for redirect
        redirectAfterLogin(router, user);
      })
      .catch((err) => {
        stopLoading();
        // ✅ Check if error response exists and has a message
        const errorMessage = err.response?.data?.message || "An unexpected error occurred.";

        console.error("Login Error:", err.response?.data || err);

        // ✅ Handle email not verified case safely
        if (errorMessage.includes("not verified")) {
          toast.warning(errorMessage);
          return;
        }
    
        toast.error("Please check your email or password ")
        // console.log("login error: ", err);
      });
  };

  // ✅ Google Login Handler
  const handleGoogleSignIn = async () => {
    try {
      const redirectUrl = router.query.redirect;
      // console.log('🔗 Google Login - Router Ready:', router.isReady);
      // console.log('🔗 Google Login - Router Query:', router.query);
      // console.log('🔗 Google Login - Redirect URL:', redirectUrl);
      // console.log('🔗 Google Login - Full URL:', window.location.href);
      
      const googleAuthUrl = redirectUrl 
        ? `${process.env.NEXT_PUBLIC_API_MAIN}/auth/google?redirect=${encodeURIComponent(redirectUrl)}`
        : `${process.env.NEXT_PUBLIC_API_MAIN}/auth/google`;
      
      // console.log('🔗 Google Auth URL:', googleAuthUrl);
      window.location.href = googleAuthUrl;
    } catch (error) {
      console.error("❌ Google Login Error:", error);
      toast.error("Google login failed. Please try again.");
    }
  };
  


  const handleFacebookSignIn = async () => {
    try {
      const redirectUrl = router.query.redirect;
      // console.log('📘 Facebook Login - Router Query:', router.query);
      // console.log('📘 Facebook Login - Redirect URL:', redirectUrl);
      // console.log('📘 Facebook Login - Full URL:', window.location.href);
      
      const facebookAuthUrl = redirectUrl 
        ? `${process.env.NEXT_PUBLIC_API_MAIN}/auth/facebook?redirect=${encodeURIComponent(redirectUrl)}`
        : `${process.env.NEXT_PUBLIC_API_MAIN}/auth/facebook`;
      
      // console.log('📘 Facebook Auth URL:', facebookAuthUrl);
      
      // For Safari compatibility, use a popup approach instead of direct redirect
      const width = 600;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        facebookAuthUrl,
        'facebook-login',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
      );

      // Check if popup was blocked
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        // Fallback to direct redirect if popup is blocked
        window.location.href = facebookAuthUrl;
        return;
      }

      // Listen for messages from popup
      const handleMessage = (event) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'SOCIAL_LOGIN_SUCCESS') {
          const userData = event.data.userData;
          
          // Store user data
          localStorage.setItem("userData", JSON.stringify(userData));
          dispatch(loginSuccess({ user: userData, status: "authenticated" }));
          window.dispatchEvent(new Event("userLoggedIn"));
          
          // Use helper function for redirect
          redirectAfterLogin(router, userData);
          
          window.removeEventListener('message', handleMessage);
        } else if (event.data.type === 'SOCIAL_LOGIN_ERROR') {
          toast.error("Facebook login failed. Please try again.");
          window.removeEventListener('message', handleMessage);
        }
      };

      window.addEventListener('message', handleMessage);

      // Check if popup is closed manually
      const checkPopup = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopup);
          window.removeEventListener('message', handleMessage);
        }
      }, 1000);

    } catch (error) {
      console.error("Facebook login error:", error);
      toast.error("Facebook login failed. Please try again.");
    }
  };


  // Handle Email Verification
  useEffect(() => {
    if (router.query.verified) {
      toast.success("Email verified successfully. Please login.");
    }
  }, [router.query.verified]);


  return (
    <Fragment>
      <Head>
        <title>Cadbull | Login</title>
        <meta name="description" content="World Largest 2d CAD Library." />
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_FRONT_URL}/login`} />
      </Head>
      <AuthLayout title={pageTitle.title} description={pageTitle.description}>
        {/* Form  */}
        <form
          className="row g-3 mb-3 mb-md-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Email */}
          <Controller
            name="loginInput"
            control={control}
            // rules={{ required: "Email is required", pattern: /^\S+@\S+$/i }}
            rules={{ required: "Email or Username is required" }}
            render={({ field }) => (
              <div className="col-lg-12">
                <div className="d-flex gap-2 align-items-center mb-1">
                  <label>Email Id</label>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Your Email"
                  {...field}
                />
                {errors.loginInput && (
                  <p className="text-danger">{errors.loginInput.message}</p>
                )}
              </div>
            )}
          />
          {/* Password */}
          <Controller
            name="password"
            control={control}
            rules={{ required: "Password is required", minLength: 8 }}
            render={({ field }) => (
              <div className="col-lg-12 position-relative">
                <div className="d-flex gap-2 align-items-center mb-1">
                  <label>Password</label>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Password"
                  {...field}
                  style={{ paddingRight: "2.5rem" }} // make space for the icon
                />
                {/* Eye Icon/Button */}
                <span
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: "absolute",
                    right: "18px",
                    top: "60%",
                    cursor: "pointer",
                    zIndex: 2,
                    color: "#555"
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {errors.password && (
                  <p className="text-danger">{errors.password.message}</p>
                )}
              </div>
            )}
          />
          {/* Forget your password? */}
          <div className="col-lg-12">
            <a href="/auth/forgot-password" className="text-danger">
              Forgot your password?
            </a>
          </div>

          <div className="col-lg-12">
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              onChange={handleCaptchaChange}
              theme="light" // or "dark"
            />
          </div>

          <div className="col-lg-12">
            <div className="mt-2 mt-md-3">
              <button disabled={isLoading?true:false} type="submit" className="btn btn-lg btn-secondary w-100">
                Login to Your Account
              </button>
            </div>
          </div>
        </form>
        {/* Social Button  */}
        <div className="mt-4 d-flex flex-column flex-xl-row gap-3 gap-xl-2 mb-3 mb-md-4">
          <button
            onClick={() => {
              handleGoogleSignIn();
              // router.push("/");
            }}
              
            type="button"
            className="btn btn-default d-flex gap-1 align-items-center justify-content-center"
          >
            <Icons.Google />
            <span>Login in with Google</span>
          </button>
          <button
            onClick={() => {
              handleFacebookSignIn();
            }}
            type="button"
            className="btn btn-secondary-variant d-flex gap-1 align-items-center justify-content-center"
          >
            <Icons.Facebook />
            <span>Login in with Facebook</span>
          </button>
         
            <Link href={`/auth/registerPhone${router.query.redirect ? `?redirect=${encodeURIComponent(router.query.redirect)}` : ''}`}
            className="btn btn-success d-flex gap-1 align-items-center justify-content-center"
            
            >
            <Icons.Phone />
            <span>Login in with Mobile</span>
            </Link>
          
        </div>
        <div className="text-center">
          <p>
            <span>Don&apos;t have an account?</span>{" "}
            <Link href="/auth/register" className="text-danger">
              Sign Up
            </Link>
          </p>
        </div>
      </AuthLayout>
    </Fragment>
  );
};

Login.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default Login;