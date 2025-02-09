import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import Icons from "@/components/Icons";
import Link from "next/link";
import { Fragment, useEffect } from "react";
import Head from "next/head";
import { useForm, Controller } from "react-hook-form";
import { signupApiHandler, socialLogin } from "@/service/api";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../redux/app/features/authSlice";
import { signIn, useSession } from "next-auth/react";
import useLoading from "@/utils/useLoading";
import { toast } from "react-toastify";

const pageTitle = {
  title: "Register A New Account",
  description:
    "Choose from 254195+ Free & Premium CAD Files with new additions published every second month",
};

const Register = () => {
  const { data: session } = useSession();
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

  // -------------------------------
  // Normal Registration Flow
  // -------------------------------
  const onSubmit = (data) => {
    startLoading();
    const { confirmPassword, ...formData } = data;
  
    signupApiHandler(formData)
      .then((res) => {
        stopLoading();
        
        // ✅ Log the response to check the structure
        console.log("🔄 Signup Response:", res.data);
  
        // ✅ Check if `user` exists before destructuring
        if (!res.data || !res.data.user) {
          toast.error("Unexpected response from server.");
          return;
        }
  
        const { accessToken, refreshToken, user } = res.data;
  
        // // ✅ Store tokens and user data
        // sessionStorage.setItem("accessToken", accessToken);
        // localStorage.setItem("refreshToken", refreshToken);
        // sessionStorage.setItem("userData", JSON.stringify(user));
  
        // ✅ Store tokens in localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userData", JSON.stringify(user));

        // ✅ Dispatch Redux login state
        dispatch(loginSuccess({ user, accessToken, status: "authenticated" }));

        // ✅ Trigger storage event to sync across tabs
        window.dispatchEvent(new Event("userLoggedIn"));
  
        toast.success("Registration was successful. Redirecting...", { autoClose: 2000 });
  
        // ✅ Redirect based on user role
        setTimeout(() => {
          if (user.role === 1) {
            router.push("/admin/dashboard"); // Super Admin
          } else if (user.role === 5) {
            router.push("/admin/dashboard/products/view-projects"); // Content Creator
          } else {
            router.push("/"); // Default home page
          }
        }, 2000);
      })
      .catch((err) => {
        stopLoading();
        if (err.response && err.response.status === 400) {
          toast.error(err.response.data.message);
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
  
  // -------------------------------
  // OAuth Redirect Handling (Google Login)
  // This useEffect will run if the URL has OAuth parameters.
  // -------------------------------
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    // Expect the backend to redirect with these names:
    const accessToken = urlParams.get("accessToken");
    const refreshToken = urlParams.get("refreshToken");
    // Use a different variable name to avoid confusion with our Redux token property:
    const userParam = urlParams.get("user");

    if (accessToken && refreshToken && userParam) {
      try {
        // Parse and decode the user data (assuming it was encoded on the backend)
        const userData = JSON.parse(decodeURIComponent(userParam));
        console.log("✅ OAuth Callback User Data:", userData);

        // Store tokens and user data consistently
        // sessionStorage.setItem("accessToken", accessToken);
        // localStorage.setItem("refreshToken", refreshToken);
        // ✅ Store tokens and user data in localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userData", JSON.stringify(userData));

        // Dispatch Redux login state with accessToken
        dispatch(loginSuccess({ user: userData, accessToken, status: "authenticated" }));

        // ✅ Sync authentication across tabs
        window.dispatchEvent(new Event("userLoggedIn"));

        // Redirect based on user role
        if (userData.role === 1) {
          router.push("/admin/dashboard");
        } else if (userData.role === 5) {
          router.push("/admin/products/view-projects");
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("❌ Failed to parse user data:", error);
        toast.error("Failed to retrieve user details.");
        router.push("/auth/register");
      }
    }
  }, [router, dispatch]);

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
          <div className="col-lg-6">
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
                  type="password"
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  placeholder="8 Digit Pin"
                />
              )}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password.message}</div>
            )}
          </div>
          {/* Confirm Password */}
          <div className="col-lg-6">
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
                  type="password"
                  className={`form-control ${
                    errors.confirmPassword ? "is-invalid" : ""
                  }`}
                  placeholder="8 Digit Pin"
                />
              )}
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback">
                {errors.confirmPassword.message}
              </div>
            )}
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