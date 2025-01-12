"use client";
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import Icons from "@/components/Icons";
import Link from "next/link";
import Head from "next/head";
import { Fragment, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../../redux/app/features/authSlice";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import { loginApiHandler, socialLogin, getUserProfile, } from "@/service/api";
import withAuth from "@/HOC/withAuth";
import useLoading from "@/utils/useLoading";
import { toast } from "react-toastify";
import useSessionStorageData from "@/utils/useSessionStorageData";


const pageTitle = {
  title: "Login to Your Account",
  description:
    "Choose from 254195+ Free & Premium CAD Files with new additions published every second month",
};

const Register = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const [isLoading,startLoading,stopLoading]=useLoading();
  const isAuthenticated=useSessionStorageData('userData')

  useEffect(() => {
    const storedUserData = sessionStorage.getItem("userData");
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      dispatch(loginSuccess({ user: userData, status: "authenticated" }));
    }
  }, []);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // Handle form submission here
    startLoading()
    loginApiHandler(data)
      .then((res) => {
        const { token, user } = res.data;
        const userData = user;
        console.log("user: ", res.data);
        
        sessionStorage.setItem("userData", JSON.stringify({ user: user, token: token }));
        sessionStorage.setItem("token", token);

        // dispatch(loginSuccess({ user: user, status: "authenticated" }));
        dispatch(loginSuccess({ user: user, token:token , status: "authenticated" }));
        stopLoading()
        //  if(router.query.redirect){
        //   router.push(router.query.redirect)
        //    return
        //  }
         router.push( router.query?.redirect || '/')
      })
      .catch((err) => {
        stopLoading();
        toast.error("Please check your email or password ")
        console.log(err);
      });
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google");
      const socialLoginResponse = await socialLogin(session.user);
      const userData = socialLoginResponse.data;
      sessionStorage.setItem("userData", JSON.stringify(userData));
      dispatch(
        loginSuccess({
          user: userData,
          status: "authenticated",
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await signIn("facebook");
      const socialLoginResponse = await socialLogin(session.user);
      const userData = socialLoginResponse.data;
      sessionStorage.setItem("userData", JSON.stringify(userData));
      dispatch(
        loginSuccess({
          user: userData,
          status: "authenticated",
        })
      );
    } catch (error) {
      console.error(error);
    }
  };
//!prevent authenticated user to access page again 
useEffect(()=>{
  if(isAuthenticated!==null){
    router.push('/')
  }
},
[router,isAuthenticated])

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
