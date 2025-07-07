import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import Head from "next/head";
import { useForm, Controller } from "react-hook-form";
// import { sendOtpApiHandler, verifyOtpApiHandler } from "@/service/api"; // Import the necessary API functions
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../redux/app/features/authSlice";
import { auth, RecaptchaVerifier } from "@/utils/firebase";
import { signInWithPhoneNumber } from "firebase/auth";
import api from "@/service/api";
import { app } from "@/utils/firebase";

const pageTitle = {
  title: "Register A New Account",
  description:
    "Choose from 254195+ Free & Premium CAD Files with new additions published every second month",
};

const RegisterPhone = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
    reset
  } = useForm();
  const router = useRouter();
  const [showOTPSection, setShowOTPSection] = useState(false);
  const [otpSent, setOtpSent] = useState(false); // To track whether OTP has been sent
  const [disableResend, setDisableResend] = useState(false); // To disable the resend button
  const [countdown, setCountdown] = useState(30);
  const dispatch = useDispatch();
  
  const [confirmationResult, setConfirmationResult] = useState(null);


  // useEffect(() => {
  //   let timer;
  //   if (disableResend && countdown > 0) {
  //     // Decrease countdown every second
  //     timer = setInterval(() => {
  //       setCountdown((prevCountdown) => prevCountdown - 1);
  //     }, 1000);
  //   } else if (countdown === 0) {
  //     // Reset countdown and enable resend button
  //     setCountdown(30);
  //     setDisableResend(false);
  //     clearInterval(timer);
  //   }

  //   return () => clearInterval(timer);
  // }, [disableResend, countdown]);


  // useEffect(() => {
  //   const storedUserData = sessionStorage.getItem("userData");
  //   if (storedUserData) {
  //     const userData = JSON.parse(storedUserData);
  //     dispatch(loginSuccess({ user: userData, status: "authenticated" }));
  //   }
  // }, []);


  // const onSubmit = async (data) => {
  //   try {
  //     // Send OTP only if it hasn't been sent already
  //     if (!otpSent) {
  //       await sendOtpApiHandler(data.mobile); // Call the sendOtpApiHandler function to send OTP
  //       setOtpSent(true);
  //       setDisableResend(true); // Disable the resend button
       
       
  //     }
  //     setShowOTPSection(true);
  //   } catch (error) {
  //     // Handle error
  //     console.error("Error sending OTP:", error);
  //   }
  // };

  // Helper: create or return recaptcha verifier
  // Helper to create/reuse
  // Helper to create/reuse
  // const getOrCreateRecaptcha = () => {
  //   console.log("auth instance:", auth);
  //   console.log("app instance:", app);

  //   if (typeof window !== "undefined" && document.getElementById("recaptcha-container")) {
  //     if (!window.recaptchaVerifier) {
  //       window.recaptchaVerifier = new RecaptchaVerifier(
  //         "recaptcha-container",
  //         { size: "normal" },
  //         auth
  //       );
  //       window.recaptchaVerifier.render();
  //     }
  //     return window.recaptchaVerifier;
  //   }
  //   throw new Error("Recaptcha container not ready");
  // };
const recaptchaLoaded = useRef(false);
const [recaptchaReady, setRecaptchaReady] = useState(false);

useEffect(() => {
  if (typeof window === "undefined") return;
  if (!recaptchaLoaded.current && document.getElementById("recaptcha-container")) {
    recaptchaLoaded.current = true;
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        { size: "normal" },
        auth
      );
      window.recaptchaVerifier.render().then(() => setRecaptchaReady(true));
    } catch (err) {
      console.error("RecaptchaVerifier failed to init:", err);
    }
  }
}, []);



  const onSubmit = async (data) => {
  let phoneNumber = data.mobile;
  if (!phoneNumber.startsWith("+")) {
    alert("Please enter in +911234567890 format");
    return;
  }
  try {
    const appVerifier = window.recaptchaVerifier;
    console.log("appVerifier is", appVerifier);
    if (!appVerifier) throw new Error("RecaptchaVerifier missing");
    const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    setConfirmationResult(result);
    setOtpSent(true);
    setShowOTPSection(true);
    setDisableResend(true);
  } catch (error) {
    alert("Failed to send OTP: " + error.message);
    console.error(error);
  }
};






  // const handleResendCode = async () => {
  //   try {
  //     await sendOtpApiHandler(watch("mobile")); // Call the sendOtpApiHandler function to resend OTP
  //     setOtpSent(true);
  //     setDisableResend(true); // Disable the resend button
  //     reset({ otp: "" });
  //   } catch (error) {
  //     // Handle error
  //     console.error("Error resending OTP:", error);
  //   }
  // };

  // const onSubmitOTP = async (data) => {
  //   const Verify = {
  //     phone_number: data.mobile,
  //     otp: data.otp,
  //   };
  //   try {
  //     // Verify the OTP
  //     const response = await verifyOtpApiHandler(Verify);
  //     sessionStorage.setItem("userData", JSON.stringify(response.data));
  //     dispatch(loginSuccess({ user: response.data, status: "authenticated" }));
  //     router.push("/profile/edit");
  //     // Redirect or perform any other action upon successful OTP verification
  //   } catch (error) {
  //     // Handle error
  //     console.error("Error verifying OTP:", error);
  //   }
  // };



  return (
    <Fragment>
      <Head>
        <title>Cadbull | Register</title>
        <meta name="description" content="World Largest 2d CAD Library." />
      </Head>
      <div id="recaptcha-container" style={{ minHeight: 60 }} />
      <AuthLayout title={pageTitle.title} description={pageTitle.description}>
      {/* <div id="recaptcha-container" style={{ minHeight: 60 }} /> */}
        {showOTPSection ? (
          // Show OTP input section
          <form
            onSubmit={handleSubmit(onSubmitOTP)}
            className="row g-3 mb-3 mb-md-4"
          >
            <div className="col-lg-12">
              <div className="mt-2 text-center"></div>
                <p>
                Please enter the OTP sent to 
                    <span className="fw-bold"> </span>
                  <Link href={"/auth/registerPhone"}
                    
                    className=" btn-link p-0"
                    onClick={()=>setShowOTPSection(false)}
                  >
                    Change Number
                  </Link>{" "}
              
                </p>
              <Controller
                name="otp"
                control={control}
                rules={{
                  required: "OTP is required",
                  minLength: 6, // Modify as per your OTP format
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className={`form-control ${errors.otp ? "is-invalid" : ""}`}
                    placeholder="Enter OTP"
                  />
                )}
              />
              {errors.otp && (
                <div className="invalid-feedback">{errors.otp.message}</div>
              )}
            </div>
            <div className="col-lg-12">
              <div className="mt-2 mt-md-3">
                <button
                  type="submit"
                  className="btn btn-lg btn-secondary w-100"
                >
                  Verify
                </button>
              </div>
              <div className="mt-2 text-center">
                <p>
                  {disableResend ? (
                    <span>Not received your code? 00:{countdown} </span>
                  ) : (
                    <>
                      <span>Not received your code? </span>
                      <button
                        type="button"
                        className="btn btn-link p-0"
                        onClick={handleResendCode}
                        disabled={disableResend}
                      >
                        Resend code
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
          </form>
        ) : (
          // Show mobile number input section
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="row g-3 mb-3 mb-md-4"
          >
            <div className="col-lg-12">
              <div className="d-flex gap-2 align-items-center mb-1">
                <label>Mobile Number</label>
              </div>
              <Controller
                name="mobile"
                control={control}
                rules={{
                  required: "Mobile number is required",
                  // pattern: /^[0-9]{10}$/i, // Modify pattern as per your mobile number format
                  pattern: /^\+[1-9]\d{1,14}$/, // E.164 international format
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="tel"
                    className={`form-control ${
                      errors.mobile ? "is-invalid" : ""
                    }`}
                    placeholder="Enter Your Mobile Number"
                  />
                )}
              />
              {errors.mobile && (
                <div className="invalid-feedback">{errors.mobile.message}</div>
              )}
            </div>

            <div id="recaptcha-container" />

            <div className="col-lg-12">
              <div className="mt-2 mt-md-3">
                <button
                  type="submit"
                  className="btn btn-lg btn-secondary w-100"
                  disabled={!recaptchaReady || otpSent}
                >
                  {otpSent ? "Send OTP Again" : "Send OTP"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Social Button */}
        <div className="mt-4 d-flex flex-column flex-xl-row gap-3 gap-xl-2 mb-3 mb-md-4">
          {/* Include social login buttons here if needed */}
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

RegisterPhone.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default RegisterPhone;



