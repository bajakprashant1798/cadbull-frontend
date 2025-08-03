import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import Icons from "@/components/Icons";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import Head from "next/head";
import { useForm, Controller } from "react-hook-form";
import { signupApiHandler, socialLogin } from "@/service/api";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../redux/app/features/authSlice";
import useLoading from "@/utils/useLoading";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";

const pageTitle = {
  title: "Register A New Account",
  description:
    "Choose from 254195+ Free & Premium CAD Files with new additions published every second month",
};

const Register = () => {
  //useLoading hook state 
  const [isLoading,startLoading,stopLoading]=useLoading();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm();
  const router = useRouter();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  
  const [captchaValue, setCaptchaValue] = useState(null);

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };
  
  // -------------------------------
  // Normal Registration Flow
  // -------------------------------
  const onSubmit = (data) => {
    // Ensure the captcha is solved
    if (!captchaValue) {
      toast.error("Please verify that you are not a robot.");
      return;
    }

    startLoading();
    const { confirmPassword, ...formData } = data;
  
    signupApiHandler(formData)
      .then((res) => {
        stopLoading();
        
        // ✅ Log the response to check the structure
        // console.log("🔄 Signup Response:", res.data);
  
        // // ✅ Handle email already exists but not verified case
        // if (res.data.message.includes("not verified")) {
        //   toast.warning(res.data.message);
        //   return;
        // }
        // Handle all cases by backend code
       const code = res.data.code;
        const message = res.data.message;
        if (code === "EMAIL_NOT_VERIFIED") {
          toast.warning(message);
          return;
        } else if (code === "EMAIL_EXISTS") {
          toast.error(message);
          return;
        } else if (code === "REACTIVATED") {
          toast.success(message);
          router.push("/auth/login");
          return;
        } else if (code === "REGISTERED") {
          toast.success(message);
          router.push("/auth/login");
          return;
        }

        if (!code) toast.info(message || "Something happened. Please check your email.");


        // // ✅ Check if `user` exists before destructuring
        // if (!res.data || !res.data.user) {
        //   toast.error("Unexpected response from server.");
        //   return;
        // }
  
        // const { accessToken, refreshToken, user } = res.data;
  
        
        // // ✅ Store tokens and user data ONLY IF email is verified
        // if (user.is_email_verify === 1) {
        //   // Since tokens are stored in HTTP‑only cookies, we do not store them in localStorage.
        //   // You may choose to store non-sensitive user data if needed.
        //   localStorage.setItem("userData", JSON.stringify(user));

        //   // Dispatch login success without token
        //   dispatch(loginSuccess({ user, status: "authenticated" }));
        //   window.dispatchEvent(new Event("userLoggedIn"));


        //   toast.success("Registration successful. Redirecting...", { autoClose: 2000 });

        //   setTimeout(() => {
        //     if (user.role === 1) {
        //       router.push("/admin/dashboard");
        //     } else if (user.role === 5) {
        //       router.push("/admin/dashboard/products/view-projects");
        //     } else {
        //       router.push("/");
        //     }
        //   }, 2000);
        // } else {
        //   toast.warning("Please verify your email before register.", { autoClose: 2000 });
        //   router.push("/auth/login");
        // }
      })
      .catch((err) => {
        stopLoading();
        // if (err.response && err.response.status === 400) {
        //   toast.error(err.response.data.message);
        // } else {
        //   toast.error("Registration failed. Please try again.");
        // }
        // console.error("Registration Error:", err);
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message); // This will show backend's custom message
        } else {
          toast.error("Registration failed. Please try again.");
        }
        console.error("Registration Error:", err);
      });
  };
  
  

  const handleGoogleSignIn = async () => {
    try {
      // ✅ Redirect user to backend OAuth route
      window.location.href = `${process.env.NEXT_PUBLIC_API_MAIN}/auth/google`;
    } catch (error) {
      console.error("❌ Google Login Error:", error);
      toast.error("Google login failed. Please try again.");
    }
  };

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
  
  const handleFacebookSignIn = async () => {
    try {
      // For Safari compatibility, use a popup approach instead of direct redirect
      const width = 600;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        `${process.env.NEXT_PUBLIC_API_MAIN}/auth/facebook`,
        'facebook-login',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
      );

      // Check if popup was blocked
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        // Fallback to direct redirect if popup is blocked
        window.location.href = `${process.env.NEXT_PUBLIC_API_MAIN}/auth/facebook`;
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
          
          // Redirect based on role
          if (userData.role === 1) {
            router.replace("/admin/dashboard");
          } else {
            router.replace("/");
          }
          
          window.removeEventListener('message', handleMessage);
        } else if (event.data.type === 'SOCIAL_LOGIN_ERROR') {
          toast.error("Facebook registration failed. Please try again.");
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
      console.error("Facebook registration error:", error);
      toast.error("Facebook registration failed. Please try again.");
    }
  };

  // -------------------------------
  // OAuth Redirect Handling (Google Login)
  // This useEffect will run if the URL has OAuth parameters.
  // -------------------------------
  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   // Expect the backend to redirect with these names:
  //   const accessToken = urlParams.get("accessToken");
  //   const refreshToken = urlParams.get("refreshToken");
  //   // Use a different variable name to avoid confusion with our Redux token property:
  //   const userParam = urlParams.get("user");

  //   if (accessToken && refreshToken && userParam) {
  //     try {
  //       // Parse and decode the user data (assuming it was encoded on the backend)
  //       const userData = JSON.parse(decodeURIComponent(userParam));
  //       console.log("✅ OAuth Callback User Data:", userData);

  //       // Store tokens and user data consistently
  //       // sessionStorage.setItem("accessToken", accessToken);
  //       // localStorage.setItem("refreshToken", refreshToken);
  //       // ✅ Store tokens and user data in localStorage
  //       localStorage.setItem("accessToken", accessToken);
  //       localStorage.setItem("refreshToken", refreshToken);
  //       localStorage.setItem("userData", JSON.stringify(userData));

  //       // Dispatch Redux login state with accessToken
  //       dispatch(loginSuccess({ user: userData, accessToken, status: "authenticated" }));

  //       // ✅ Sync authentication across tabs
  //       window.dispatchEvent(new Event("userLoggedIn"));

  //       // Redirect based on user role
  //       if (userData.role === 1) {
  //         router.push("/admin/dashboard");
  //       } else if (userData.role === 5) {
  //         router.push("/admin/products/view-projects");
  //       } else {
  //         router.push("/");
  //       }
  //     } catch (error) {
  //       console.error("❌ Failed to parse user data:", error);
  //       toast.error("Failed to retrieve user details.");
  //       router.push("/auth/register");
  //     }
  //   }
  // }, [router, dispatch]);

  return (
    <Fragment>
      <Head>
        <title>Cadbull | Register</title>
        <meta name="description" content="World Largest 2d CAD Library." />
      </Head>
      <AuthLayout title={pageTitle.title} description={pageTitle.description}>
        {/* Form  */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="row g-3 mb-3 mb-md-4"
        >
          {/* Email */}
          <div className="col-lg-12">
            <div className="d-flex gap-2 align-items-center mb-1">
              <label>Email Id</label>
            </div>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Enter Your Email"
                />
              )}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>
          {/* First Name */}
          <div className="col-md-6 col-lg-6">
            <div className="d-flex gap-2 align-items-center mb-1">
              <label>First Name</label>
            </div>
            <Controller
              name="firstname" // Change the name to "firstname"
              control={control}
              rules={{ required: "First Name is required" }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className={`form-control ${
                    errors.firstname ? "is-invalid" : ""
                  }`}
                  placeholder="Type First Name"
                />
              )}
            />
            {errors.firstname && (
              <div className="invalid-feedback">
                {errors.firstname.message}
              </div>
            )}
          </div>
          {/* Last Name */}
          <div className="col-md-6 col-lg-6">
            <div className="d-flex gap-2 align-items-center mb-1">
              <label>Last Name</label>
            </div>
            <Controller
              name="lastname" // Change the name to "lastname"
              control={control}
              rules={{ required: "Last Name is required" }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className={`form-control ${
                    errors.lastname ? "is-invalid" : ""
                  }`}
                  placeholder="Type Last Name"
                />
              )}
            />
            {errors.lastname && (
              <div className="invalid-feedback">{errors.lastname.message}</div>
            )}
          </div>
          {/* Password */}
          <div className="col-lg-6 position-relative">
            <div className="d-flex gap-2 align-items-center mb-1">
              <label>Password</label>
            </div>
            <Controller
              name="password"
              control={control}
              rules={{ required: "Password is required", minLength: 8 }}
              render={({ field }) => (
                <input
                  {...field}
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  placeholder="Password"
                />
              )}
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
              <div className="invalid-feedback">{errors.password.message}</div>
            )}
          </div>
          {/* Confirm Password */}
          <div className="col-lg-6 position-relative">
            <div className="d-flex gap-2 align-items-center mb-1">
              <label>Confirm Password</label>
            </div>
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Confirm Password is required",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type={showConfirmPassword ? "text" : "password"}
                  className={`form-control ${
                    errors.confirmPassword ? "is-invalid" : ""
                  }`}
                  placeholder="Confirm Password"
                />
              )}
            />
            {/* Eye Icon/Button */}
            <span
              onClick={() => setShowConfirmPassword((v) => !v)}
              style={{
                position: "absolute",
                right: "18px",
                top: "60%",
                cursor: "pointer",
                zIndex: 2,
                color: "#555"
              }}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.confirmPassword && (
              <div className="invalid-feedback">
                {errors.confirmPassword.message}
              </div>
            )}
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
              <button 
               disabled={isLoading?true:false}
              type="submit" className="btn btn-lg btn-secondary w-100">
                Register to Your Account
              </button>
            </div>
          </div>
        </form>

        {/* Social Button  */}
        <div className="mt-4 d-flex flex-column flex-xl-row gap-3 gap-xl-2 mb-3 mb-md-4">
          <button
            onClick={() => handleGoogleSignIn()}
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
          <Link
            href={"/auth/registerPhone"}
            type="button"
            className="btn btn-success d-flex gap-1 align-items-center justify-content-center"
          >
            <Icons.Phone />
            <span>SignUp with Mobile </span>
          </Link>
        </div>
        <div className="text-center">
          <p>
            <span>Already Signed Up?</span>{" "}
            <Link href="/auth/login" className="text-danger">
              Login your account.
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