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
import { loginApiHandler, socialLogin, getUserProfile, } from "@/service/api";
import withAuth from "@/HOC/withAuth";
import useLoading from "@/utils/useLoading";
import { toast } from "react-toastify";
import useSessionStorageData from "@/utils/useSessionStorageData";
import { getFavouriteItems } from "@/service/api";
import { setFavouriteList } from "../../../redux/app/features/projectsSlice";
// import ReCAPTCHA from "react-google-recaptcha";
// import RecaptchaComponent from "@/components/RecaptchaComponent";


const pageTitle = {
  title: "Login to Your Account",
  description:
    "Choose from 254195+ Free & Premium CAD Files with new additions published every second month",
};

const Register = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  // const { data: session } = useSession();
  const [isLoading,startLoading,stopLoading]=useLoading();
  const isAuthenticated=useSessionStorageData('userData')
  const [captchaValue, setCaptchaValue] = useState(null);

  // Set up reCAPTCHA reference if needed
  const recaptchaRef = React.createRef();

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      dispatch(loginSuccess({ user: userData, status: "authenticated" }));
    }
  }, []);
  

  useEffect(() => {
    const storedUserDataForRole = localStorage.getItem("userData");
    console.log("storedUserDataForRole", storedUserDataForRole);
    
    if (storedUserDataForRole) {
      const user = JSON.parse(storedUserDataForRole);
      console.log("storedUserDataForRole parse", user);

  
      if (user.role === 1) {
        router.push("/admin/dashboard"); 
      } else if (user.role === 5) {
        router.push("/admin/projects/view-project");
      } else {
        router.push("/");
      }
    }
  }, [router]);

  // ✅ Rehydrate tokens after page reload
  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken"); // ✅ Get from localStorage

    if (!storedAccessToken && storedRefreshToken) {
      console.log("🔄 Attempting to refresh token...");
      api.post("/auth/refresh-token", {}, {
        headers: { "x-refresh-token": storedRefreshToken },
      })
        .then((res) => {
          localStorage.setItem("accessToken", res.data.accessToken);
        })
        .catch(() => {
          console.log("❌ Refresh failed, logging out user.");
          handleLogout();
        });
    }
  }, []);

  // ✅ Handle Logout & Redirect
  const handleLogout = () => {
    sessionStorage.clear();
    
    // ✅ Remove tokens from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");

    // ✅ Dispatch event to log out from all open tabs
    // window.dispatchEvent(new Event("userLoggedOut"));

    // ✅ Redirect to login page
    setTimeout(() => {
      window.location.href = "/auth/login";
    }, 100);
  };
  

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
    // Handle form submission here
    startLoading()
    loginApiHandler(data)
      .then((res) => {
        const { accessToken, refreshToken, user } = res.data;

        if (!accessToken || !refreshToken) {
          toast.error("Login failed. Please try again.");
          return;
        }

        // // ✅ Store accessToken in sessionStorage (Cleared on tab close)
        // sessionStorage.setItem("accessToken", accessToken);
        // sessionStorage.setItem("userData", JSON.stringify({ user }));

        // ✅ Store tokens in localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userData", JSON.stringify(user));

        // // ✅ Store refreshToken in localStorage (Persistent)
        // localStorage.setItem("refreshToken", refreshToken);

        dispatch(loginSuccess({ user, accessToken, status: "authenticated" }));

        // Fetch and dispatch favorites after successful login:
        if (accessToken) {
          getFavouriteItems(accessToken)
            .then((favRes) => {
              dispatch(setFavouriteList(favRes.data.favorites || []));
              console.log("res from getfav", favRes);
              
            })
            .catch((error) => {
              console.error("Error fetching favorites:", error);
            });
        }

        // ✅ Trigger storage event to sync across tabs
        window.dispatchEvent(new Event("userLoggedIn"));

        stopLoading()
        //  if(router.query.redirect){
        //   router.push(router.query.redirect)
        //    return
        //  }

        //  router.push( router.query?.redirect || '/')

        // Redirect user based on role
        if (user.role === 1) {
          router.push("/admin/dashboard"); // Super Admin
        } else if (user.role === 5) {
          router.push("/admin/projects/view-project"); // Content Creator
        } else {
          router.push("/"); // Default for other users
        }
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
        console.log("login error: ", err);
      });
  };

  // ✅ Allow public access to home page after logout
  useEffect(() => {
    if (!isAuthenticated && router.pathname.startsWith("/admin")) {
      router.push("/auth/login"); // ✅ Redirect only for protected pages
    }
  }, [router, isAuthenticated]);

  // ✅ Prevent authenticated users from accessing login page
  // useEffect(() => {
  //   if (isAuthenticated !== null) {
  //     router.push("/");
  //   }
  // }, [router, isAuthenticated]);

  // ✅ Handle OAuth Redirect (Google Login)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("accessToken");
    const refreshToken = urlParams.get("refreshToken");
    
    if (accessToken && refreshToken) {
      // sessionStorage.setItem("accessToken", accessToken);
      // localStorage.setItem("refreshToken", refreshToken); // ✅ Store refreshToken in localStorage

      // ✅ Store tokens and user data in localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // IMPORTANT: Use the correct variable name – here, we use accessToken
      getUserData(accessToken)
        .then((res) => {
          const userData = res.data;
          // sessionStorage.setItem("userData", JSON.stringify({ user: userData }));

          // ✅ Store user data persistently in localStorage
          localStorage.setItem("userData", JSON.stringify(userData));

          dispatch(loginSuccess({ user: userData, accessToken, status: "authenticated" }));

          // ✅ Sync authentication across tabs
          window.dispatchEvent(new Event("userLoggedIn"));
    
          // Redirect based on role:
          if (userData.role === 1) {
            router.push("/admin/dashboard");
          } else if (userData.role === 5) {
            router.push("/admin/projects/view-projects");
          } else {
            router.push("/");
          }
        })
        .catch((error) => {
          console.error("❌ Failed to fetch user details:", error);
          toast.error("Failed to retrieve user details.");
          router.push("/auth/login");
        });
    } else {
      console.error("❌ No token or user data found in URL.");
    }
  }, [router]);

  // ✅ Google Login Handler
  const handleGoogleSignIn = async () => {
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_API_MAIN}/auth/google`;
    } catch (error) {
      console.error("❌ Google Login Error:", error);
      toast.error("Google login failed. Please try again.");
    }
  };
  

  // const handleFacebookSignIn = async () => {
  //   try {
  //     await signIn("facebook");
  //     const socialLoginResponse = await socialLogin(session.user);
  //     const userData = socialLoginResponse.data;
  //     localStorage.setItem("userData", JSON.stringify(userData));
  //     localStorage.setItem("accessToken", userData.accessToken);
  //     localStorage.setItem("refreshToken", refreshToken);

  //     dispatch(
  //       loginSuccess({
  //         user: userData,
  //         status: "authenticated",
  //       })
  //     );
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // Handle Email Verification
  useEffect(() => {
    if (router.query.verified) {
      toast.success("Email verified successfully. Please login.");
    }
  }, [router.query.verified]);


  // ✅ Prevent logged-in users from accessing login page, but allow others to access home page freely
  useEffect(() => {
    if (isAuthenticated !== null && router.pathname.startsWith("/auth")) {
      router.push("/");
    }
  }, [router, isAuthenticated]);


  return (
    <Fragment>
      <Head>
        <title>Cadbull | Login</title>
        <meta name="description" content="World Largest 2d CAD Library." />
      </Head>
      <AuthLayout title={pageTitle.title} description={pageTitle.description}>
        {/* Form  */}
        <form
          className="row g-3 mb-3 mb-md-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Email */}
          <Controller
            name="email"
            control={control}
            rules={{ required: "Email is required", pattern: /^\S+@\S+$/i }}
            render={({ field }) => (
              <div className="col-lg-12">
                <div className="d-flex gap-2 align-items-center mb-1">
                  <label>Email Id</label>
                </div>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter Your Email"
                  {...field}
                />
                {errors.email && (
                  <p className="text-danger">{errors.email.message}</p>
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
              <div className="col-lg-12">
                <div className="d-flex gap-2 align-items-center mb-1">
                  <label>Password</label>
                </div>
                <input
                  type="password"
                  className="form-control"
                  placeholder="8 Digit Pin"
                  {...field}
                />
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

          {/* <div className="col-lg-12">
            <RecaptchaComponent
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              onChange={(value) => setCaptchaValue(value)}
              ref={recaptchaRef}
            />
          </div> */}

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
              router.push("/");
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
              router.push("/");
            }}
            type="button"
            className="btn btn-secondary-variant d-flex gap-1 align-items-center justify-content-center"
          >
            <Icons.Facebook />
            <span>Login in with Facebook</span>
          </button>
         
            <Link href="/auth/registerPhone" 
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

Register.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default Register;
