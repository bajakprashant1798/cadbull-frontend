// import AuthLayout from "@/layouts/AuthLayout";
// import MainLayout from "@/layouts/MainLayout";
// import Link from "next/link";
// import { Fragment, useEffect, useRef, useState } from "react";
// import Head from "next/head";
// import { useForm, Controller } from "react-hook-form";
// import { useRouter } from "next/router";
// import { useDispatch, useSelector } from "react-redux";
// import { loginSuccess } from "../../../redux/app/features/authSlice";
// import { auth } from "@/utils/firebase";
// import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// import { verifyOtpApiHandler, linkPhoneApiHandler } from "@/service/api";
// import api from "@/service/api"
// import PhoneInput from 'react-phone-input-2'
// import 'react-phone-input-2/lib/style.css'
// import { redirectAfterLogin } from "@/utils/redirectHelpers";


// const pageTitle = {
//   title: "Register A New Account",
//   description: "Choose from 254195+ Free & Premium CAD Files with new additions published every second month",
// };
// const RESEND_TIMER = 30;

// const RegisterPhone = () => {
//   // Forms: one for phone, one for OTP
//   const { handleSubmit: handlePhoneSubmit, control: controlPhone, reset: resetPhone, formState: { errors: errorsPhone } } = useForm();
//   const { handleSubmit: handleOtpSubmit, control: controlOtp, reset: resetOtp, formState: { errors: errorsOtp } } = useForm();

//   const router = useRouter();
//   const dispatch = useDispatch();

//   // State
//   const [showOTPSection, setShowOTPSection] = useState(false);
//   const [disableResend, setDisableResend] = useState(false);
//   const [countdown, setCountdown] = useState(RESEND_TIMER);
//   const [loading, setLoading] = useState(false);
//   const [confirmationResult, setConfirmationResult] = useState(null);
//   const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
//   const [error, setError] = useState("");
//   // const [phone, setPhone] = useState(""); // The phone that OTP was sent to
//   const [infoMessage, setInfoMessage] = useState("");
//   const [showEmailInput, setShowEmailInput] = useState(false);
//   const [otpStepData, setOtpStepData] = useState({}); // Store idToken, phoneNumber for next step
//   const { handleSubmit: handleEmailSubmit, register: registerEmail, formState: { errors: emailErrors }, reset: resetEmail, getValues: getEmailValues } = useForm();
//   const [registrationSuccessMessage, setRegistrationSuccessMessage] = useState("");

//   const [phone, setPhone] = useState(""); // phone will be in '919999999999' format, you prepend "+"

//   // console.log('render', { showOTPSection, showEmailInput });

//   // Recaptcha load only once
//   const recaptchaLoaded = useRef(false);

//   // useEffect(() => {
//   //   if (typeof window !== "undefined" && !recaptchaLoaded.current) {
//   //     recaptchaLoaded.current = true;
//   //     try {
//   //       const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
//   //         size: "normal",
//   //         callback: () => {},
//   //         "expired-callback": () => {
//   //           setError("Recaptcha expired, please try again.");
//   //         }
//   //       });
//   //       setRecaptchaVerifier(verifier);
//   //       verifier.render().catch(console.error);
//   //     } catch (err) {
//   //       setError("Recaptcha failed to initialize. Try refreshing.");
//   //     }
//   //   }
//   //   return () => { if (recaptchaVerifier) recaptchaVerifier.clear(); };
//   // }, []);

//   useEffect(() => {
//     // Only (re-)initialize when on phone form (not OTP, not Email)
//     if (!showOTPSection && !showEmailInput) {
//       // This runs on mount and when coming back to phone entry
//       recaptchaLoaded.current = false;
//       setRecaptchaVerifier(null); // clear previous
//       if (typeof window !== "undefined") {
//         try {
//           const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
//             size: "normal",
//             callback: () => {},
//             "expired-callback": () => setError("Recaptcha expired, please try again.")
//           });
//           setRecaptchaVerifier(verifier);
//           verifier.render().catch(console.error);
//           recaptchaLoaded.current = true;
//         } catch (err) {
//           setError("Recaptcha failed to initialize. Try refreshing.");
//         }
//       }
//     }
//     // On unmount, clear verifier
//     // return () => { if (recaptchaVerifier) recaptchaVerifier.clear(); };
//     return () => {
//       try {
//         if (recaptchaVerifier && typeof recaptchaVerifier.clear === "function") {
//           recaptchaVerifier.clear();
//         }
//       } catch (err) {
//         // Silence or log error as needed
//         // console.log("Error clearing recaptcha verifier:", err);
        
//       }
//     };

//   }, [showOTPSection, showEmailInput]);


//   // Resend OTP countdown
//   useEffect(() => {
//     let timer;
//     if (disableResend && countdown > 0) {
//       timer = setInterval(() => setCountdown(c => c - 1), 1000);
//     } else if (countdown === 0) {
//       setCountdown(RESEND_TIMER);
//       setDisableResend(false);
//       clearInterval(timer);
//     }
//     return () => clearInterval(timer);
//   }, [disableResend, countdown]);

//   // On login, auto-load
//   useEffect(() => {
//     const storedUserData = localStorage.getItem("userData");
//     if (storedUserData) {
//       const userData = JSON.parse(storedUserData);
//       dispatch(loginSuccess({ user: userData, status: "authenticated" }));
//     }
//   }, [dispatch]);

//   // E.164 phone format
//   const formatPhoneNumber = (number) => {
//     let n = number.trim().replace(/\D/g, "");
//     if (!number.startsWith("+")) {
//       if (n.length === 10) return "+91" + n;
//       return "+" + n;
//     }
//     return number;
//   };

//   // Phone form submit: send OTP
//   const onSendOtp = async (data) => {
//     setError("");
//     setLoading(true);
//     try {
//       if (!recaptchaVerifier) {
//         setError("Recaptcha is not ready yet. Please wait...");
//         setLoading(false);
//         return;
//       }
//       // const formattedPhone = formatPhoneNumber(data.mobile);
//       // const confirmation = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);

//       const formattedPhone = phone;
//       if (!formattedPhone || formattedPhone.length < 8) { // basic check
//         setError("Please enter a valid phone number.");
//         setLoading(false);
//         return;
//       }
//       const confirmation = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);


//       setConfirmationResult(confirmation);
//       setPhone(formattedPhone); // Store the phone used for OTP
//       setShowOTPSection(true);
//       setDisableResend(true);
//       setCountdown(RESEND_TIMER);
//       resetOtp(); // Clear any old OTP value
//     } catch (err) {
//       let msg = "Failed to send OTP. ";
//       if (err.code === "auth/invalid-phone-number") msg = "Invalid phone number.";
//       else if (err.code === "auth/too-many-requests") msg = "Too many requests, try again later.";
//       else if (err.code === "auth/quota-exceeded") msg = "SMS quota exceeded.";
//       setError(msg);

//       // Add this for debugging:
//       console.error("OTP send error:", err);
//       if (recaptchaVerifier) recaptchaVerifier.clear();
//       setTimeout(() => recaptchaVerifier && recaptchaVerifier.render(), 1000);
//     }
//     setLoading(false);
//   };

//   // Resend OTP
//   const handleResendCode = async () => {
//     setError("");
//     setLoading(true);
//     try {
//       if (!recaptchaVerifier) {
//         setError("Recaptcha not ready. Please refresh.");
//         setLoading(false);
//         return;
//       }
//       const confirmation = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
//       setConfirmationResult(confirmation);
//       setDisableResend(true);
//       setCountdown(RESEND_TIMER);
//       resetOtp({ otp: "" });
//     } catch (err) {
//       setError("Failed to resend OTP.");
//     }
//     setLoading(false);
//   };

//   // OTP verify
//   const onSubmitOTP = async (data) => {
//     setLoading(true);
//     setError("");
//     if (!confirmationResult) {
//       setError("No OTP confirmation found. Request a new OTP.");
//       setLoading(false);
//       return;
//     }
//     try {
//       const result = await confirmationResult.confirm(data.otp);
//       const user = result.user;
//       const idToken = await user.getIdToken();
//       // POST to backend!
//       // onSubmitOTP
//       const response = await verifyOtpApiHandler({
//         idToken,
//         phone_number: user.phoneNumber,
//       });

//       // If backend says email needed, show email input form (NO REDIRECT)
//       if (response.data && response.data.message === "Email required") {
//         resetOtp();
//         setShowOTPSection(false);
//         setShowEmailInput(true);
//         setOtpStepData({ idToken, phoneNumber: user.phoneNumber });
//         setLoading(false);
//         setInfoMessage("No account was found for this phone number. Please provide your email to continue registration.");
//         return;
//       }

//       // If backend says "verify your email", show info message (NO REDIRECT)
//       if (response.data && response.data.message && response.data.message.includes("verify your email")) {
//         setShowEmailInput(false);
//         setShowOTPSection(false);
//         setOtpStepData({});
//         setPhone("");
//         resetPhone();
//         resetOtp();
//         setLoading(false);
//         setRegistrationSuccessMessage(
//           "Registration successful! Please check your inbox to verify your email before you can login."
//         );
//         return;
//       }

//       // Only if response.data.user is present, continue with login!
//       if (response.data && response.data.user) {
//         localStorage.setItem("userData", JSON.stringify(response.data.user));
//         dispatch(loginSuccess({ user: response.data.user, status: "authenticated" }));
        
//         // Use redirect helper for consistent redirect logic
//         redirectAfterLogin(router, response.data.user);
//         return;
//       }

//       // Fallback for unexpected cases:
//       setError("Unexpected response. Please try again.");
//       setLoading(false);


//     } 
//     // catch (err) {
//     //   // setError(
//     //   //   err?.response?.data?.message ||
//     //   //   "Failed to verify OTP."
//     //   // );
//     //   // 👇 Add this for detailed error info
//     //   console.error('OTP verification error:', err);
//     //   setError(
//     //     err?.message ||
//     //     err?.response?.data?.message ||
//     //     "Failed to verify OTP."
//     //   );
//     // }
//     // setLoading(false);
//     catch (err) {
//       // Handle "email not verified" with info message, NOT error
//       if (
//         err?.response?.status === 403 &&
//         err?.response?.data?.message &&
//         err.response.data.message.toLowerCase().includes("not verified")
//       ) {
//         setShowEmailInput(false);
//         setShowOTPSection(false);
//         setOtpStepData({});
//         setPhone("");
//         resetPhone();
//         resetOtp();
//         resetEmail && resetEmail(); // just in case

//         // Show info instead of error (styled in a different color if you want)
//         setRegistrationSuccessMessage(err.response.data.message);
//         setLoading(false);
//         return;
//       }

//       // Fallback for other errors
//       setError(
//         err?.response?.data?.message ||
//         err?.message ||
//         "Failed to verify OTP."
//       );
//       setLoading(false);
//     }

//   };


//   const onSubmitEmail = async (data) => {
//     setLoading(true);
//     setError("");
//     try {
//       // Send email + OTP info to backend
//       const response = await verifyOtpApiHandler({
//         idToken: otpStepData.idToken,
//         phone_number: otpStepData.phoneNumber,
//         email: data.email,
//       });
//       // 👇 This message means user must verify their email, DO NOT LOGIN YET!
//       // If backend says verify your email (no redirect!)
//       if (
//         response.data?.message &&
//         response.data.message.includes("verify your email")
//       ) {
//         setShowEmailInput(false);
//         setShowOTPSection(false);
//         setOtpStepData({});
//         setPhone("");
//         resetPhone();
//         resetOtp();
//         resetEmail();
//         setLoading(false);
//         setRegistrationSuccessMessage(
//           "Registration successful! Please check your inbox to verify your email before you can login."
//         );
//         return;
//       }

//       // Only proceed if user object is present
//       if (response.data && response.data.user) {
//         localStorage.setItem("userData", JSON.stringify(response.data.user));
//         dispatch(loginSuccess({ user: response.data.user, status: "authenticated" }));
        
//         // Use redirect helper for consistent redirect logic
//         redirectAfterLogin(router, response.data.user);
//         return;
//       }

//       setError("Unexpected response. Please try again.");
//       setLoading(false);

//     } 
//     // catch (err) {
//     //   setError(
//     //     err?.response?.data?.message ||
//     //     "Failed to link email."
//     //   );
//     // }
//     // setLoading(false);
//     catch (err) {
//       // Handle "email not verified" with info message, NOT error
//       if (
//         err?.response?.status === 403 &&
//         err?.response?.data?.message &&
//         err.response.data.message.toLowerCase().includes("not verified")
//       ) {
//         setShowEmailInput(false);
//         setShowOTPSection(false);
//         setOtpStepData({});
//         setPhone("");
//         resetPhone();
//         resetOtp();
//         resetEmail && resetEmail(); // just in case

//         // Show info instead of error (styled in a different color if you want)
//         setRegistrationSuccessMessage(err.response.data.message);
//         setLoading(false);
//         return;
//       }

//       // Fallback for other errors
//       setError(
//         err?.response?.data?.message ||
//         err?.message ||
//         "Failed to verify OTP."
//       );
//       setLoading(false);
//     }

//   };

//   const handleLinkPhone = async (emailValue) => {
//     setLoading(true);
//     setError("");
//     try {
//       const response = await linkPhoneApiHandler ({
//         idToken: otpStepData.idToken,
//         email: emailValue,
//         phone_number: otpStepData.phoneNumber,
//       });
//       // console.log("Link phone success:", response.data);
//       localStorage.setItem("userData", JSON.stringify(response.data.user));
//       dispatch(loginSuccess({ user: response.data.user, status: "authenticated" }));
      
//       // Use redirect helper for consistent redirect logic
//       redirectAfterLogin(router, response.data.user);
//     } catch (err) {
//       console.error("Link phone error:", err, err?.response?.data);
//       setError(
//         err?.response?.data?.message ||
//         "Failed to link phone."
//       );
//     }
//     setLoading(false);
//   };





//   // Change number
//   const handleChangeNumber = () => {
//     setShowOTPSection(false);
//     setConfirmationResult(null);
//     setError('');
//     setPhone("");
//     resetPhone();
//     resetOtp();
//     recaptchaLoaded.current = false;
//   };

//   return (
//     <Fragment>
//       <Head>
//         <title>Cadbull | Register</title>
//         <meta name="description" content="World Largest 2d CAD Library." />
//       </Head>
//       <AuthLayout title={pageTitle.title} description={pageTitle.description}>

//         {registrationSuccessMessage ? (
//           <div className="alert alert-success text-center my-5" style={{ fontSize: "1.1rem" }}>
//             {registrationSuccessMessage}
//             <br />
//             <Link href="/auth/login" className="btn btn-primary mt-3">
//               Go to Login
//             </Link>
//           </div>
//         ) : (
//         <>
//         {error && <div className="alert alert-danger" role="alert">{error}</div>}

//         {/* Phone form */}
//         {!showOTPSection && !showEmailInput && (
//           <form onSubmit={handlePhoneSubmit(onSendOtp)} className="row g-3 mb-3 mb-md-4">
//             <div className="col-lg-12">
//               <div className="d-flex gap-2 align-items-center mb-1">
//                 <label>Mobile Number</label>
//               </div>
//               {/* <Controller
//                 name="mobile"
//                 control={controlPhone}
//                 rules={{
//                   required: "Mobile number is required",
//                   pattern: {
//                     value: /^(\+\d{1,3}[- ]?)?\d{10}$/,
//                     message: "Please enter a valid mobile number"
//                   }
//                 }}
//                 render={({ field }) => (
//                   <input {...field}
//                     type="tel"
//                     className={`form-control ${errorsPhone.mobile ? "is-invalid" : ""}`}
//                     placeholder="Enter Your Mobile Number (+91XXXXXXXXXX)"
//                   />
//                 )}
//               />

//               {errorsPhone.mobile && <div className="invalid-feedback">{errorsPhone.mobile.message}</div>} */}
//               <div className="col-lg-12">
//                 <PhoneInput
//                   country={'in'} // Default to India or use geo-detect for user's country
//                   value={phone}
//                   onChange={val => setPhone('+' + val.replace(/^\+/, ''))}
//                   enableSearch
//                   inputProps={{
//                     name: 'mobile',
//                     required: true,
//                     className: 'form-control',
//                     autoFocus: true,
//                   }}
//                   inputStyle={{ width: "100%" }}
//                   // Optional: onlyCountries={['us', 'in', 'ae', ...]}
//                 />
//               </div>

//             </div>
//             <div className="col-lg-12">
//               <div id="recaptcha-container" style={{ marginTop: '10px' }}></div>
//             </div>
//             <div className="col-lg-12">
//               <div className="mt-2 mt-md-3">
//                 <button
//                   type="submit"
//                   className="btn btn-lg btn-secondary w-100"
//                   disabled={loading || !recaptchaVerifier}
//                 >
//                   {loading ? "Sending..." : "Send OTP"}
//                 </button>
//               </div>
//             </div>
//           </form>
//         )}

//         {/* OTP form */}
//         {showOTPSection && !showEmailInput && (
//           <form onSubmit={handleOtpSubmit(onSubmitOTP)} className="row g-3 mb-3 mb-md-4">
//             <div className="col-lg-12">
//               <div className="mt-2 text-center">
//                 <p>
//                   Please enter the OTP sent to <span className="fw-bold">{phone}</span>
//                   <br />
//                   <button type="button" className="btn btn-link p-0" onClick={handleChangeNumber}>
//                     Change Number
//                   </button>
//                 </p>
//               </div>
//               <Controller
//                 name="otp"
//                 control={controlOtp}
//                 rules={{
//                   required: "OTP is required",
//                   minLength: { value: 6, message: "OTP must be 6 digits" },
//                   maxLength: { value: 6, message: "OTP must be 6 digits" }
//                 }}
//                 render={({ field }) => (
//                   <input
//                     {...field}
//                     type="text"
//                     className={`form-control ${errorsOtp.otp ? "is-invalid" : ""}`}
//                     placeholder="Enter 6-digit OTP"
//                     maxLength="6"
//                     pattern="[0-9]{6}"
//                     autoFocus
//                   />
//                 )}
//               />
//               {errorsOtp.otp && <div className="invalid-feedback">{errorsOtp.otp.message}</div>}
//             </div>
//             <div className="col-lg-12">
//               <div id="recaptcha-container" style={{ marginTop: '10px' }} />
//             </div>
//             <div className="col-lg-12">
//               <div className="mt-2 mt-md-3">
//                 <button type="submit" className="btn btn-lg btn-secondary w-100" disabled={loading}>
//                   {loading ? "Verifying..." : "Verify OTP"}
//                 </button>
//               </div>
//               <div className="mt-2 text-center">
//                 <p>
//                   {disableResend ? (
//                     <span>Not received your code? 00:{countdown < 10 ? `0${countdown}` : countdown}</span>
//                   ) : (
//                     <>
//                       <span>Not received your code? </span>
//                       <button
//                         type="button"
//                         className="btn btn-link p-0"
//                         onClick={handleResendCode}
//                         disabled={disableResend || loading}
//                       >
//                         Resend code
//                       </button>
//                     </>
//                   )}
//                 </p>
//               </div>
//             </div>
//           </form>
//         )}

//         {/* Email Input Step (only shown when backend says "Email required") */}
//         {showEmailInput && (
//           <>
//           {infoMessage && (
//             <div className="alert alert-info mb-2">{infoMessage}</div>
//           )}
//           <form onSubmit={handleEmailSubmit(onSubmitEmail)} className="row g-3 mb-3">
//             <div className="col-lg-12">
//               <label>Email Address</label>
//               <input
//                 {...registerEmail("email", {
//                   required: "Email is required",
//                   pattern: {
//                     value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
//                     message: "Please enter a valid email"
//                   }
//                 })}
//                 type="email"
//                 className={`form-control ${emailErrors.email ? "is-invalid" : ""}`}
//                 placeholder="Enter your email"
//                 autoFocus
//               />
//               {emailErrors.email && (
//                 <div className="invalid-feedback">{emailErrors.email.message}</div>
//               )}
//             </div>
//             <div className="col-lg-12">
//               <button type="submit" className="btn btn-lg btn-secondary w-100" disabled={loading}>
//                 {loading ? "Linking..." : "Submit Email"}
//               </button>
//             </div>
//           </form>
//           </>
//         )}

//         {error === "Email exists. Please use email login or link your phone to this account." && (
//           <div className="mb-3">
//             <button
//               className="btn btn-primary w-100"
//               disabled={loading}
//               onClick={() => handleLinkPhone(getEmailValues("email"))} // Pass current email value!
//               type="button"
//             >
//               {loading ? "Linking..." : "Link Phone to Account"}
//             </button>
//           </div>
//         )}



//         <div className="mt-4 d-flex flex-column flex-xl-row gap-3 gap-xl-2 mb-3 mb-md-4">
//           {/* Social login buttons here if needed */}
//         </div>
//         <div className="text-center">
//           <p>
//             <span>Already Signed Up?</span>{" "}
//             <Link href="/auth/login" className="text-danger">
//               Login your account.
//             </Link>
//           </p>
//         </div>
//         </>
//         )}
//       </AuthLayout>
//     </Fragment>
//   );
// };

// RegisterPhone.getLayout = function getLayout(page) {
//   return <MainLayout>{page}</MainLayout>;
// };

// export default RegisterPhone;


import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import Head from "next/head";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../redux/app/features/authSlice";
import { auth } from "@/utils/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { verifyOtpApiHandler, linkPhoneApiHandler } from "@/service/api";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { redirectAfterLogin } from "@/utils/redirectHelpers";

const pageTitle = {
  title: "Register A New Account",
  description:
    "Choose from 254195+ Free & Premium CAD Files with new additions published every second month",
};
const RESEND_TIMER = 30;

const RegisterPhone = () => {
  const { handleSubmit: handlePhoneSubmit, reset: resetPhone } = useForm();
  const { handleSubmit: handleOtpSubmit, control: controlOtp, reset: resetOtp, formState: { errors: errorsOtp } } = useForm();
  const { handleSubmit: handleEmailSubmit, register: registerEmail, formState: { errors: emailErrors }, reset: resetEmail, getValues: getEmailValues } = useForm();

  const router = useRouter();
  const dispatch = useDispatch();

  const [showOTPSection, setShowOTPSection] = useState(false);
  const [disableResend, setDisableResend] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_TIMER);
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [otpStepData, setOtpStepData] = useState({});
  const [registrationSuccessMessage, setRegistrationSuccessMessage] = useState("");
  const [phone, setPhone] = useState("");

  // at the top of RegisterPhone component
  // at the top of RegisterPhone component
  // JS only (no TypeScript casts)
  useEffect(() => {
    // Remove classic v2 script if some widget injected it
    const classic = document.querySelector('script[src^="https://www.google.com/recaptcha/api.js"]');
    if (classic && classic.parentElement) classic.parentElement.removeChild(classic);

    // If classic grecaptcha leaked on the page, remove it so enterprise can load
    if (typeof window !== "undefined") {
      const gre = window.grecaptcha;
      if (gre && !gre.enterprise) {
        try { delete window.grecaptcha; } catch { window.grecaptcha = undefined; }
      }
    }
  }, []);

  function makeFreshRecaptcha() {
    try { window.__cbRecaptcha?.clear?.(); } catch {}
    window.__cbRecaptcha = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",                 // 👈 important
      callback: () => {},
      "expired-callback": () => setError("Security check expired, please try again."),
    });
    setRecaptchaVerifier(window.__cbRecaptcha);
    return window.__cbRecaptcha.render();
  }

  // Create verifier ONLY on phone step (the container exists only there)
  useEffect(() => {
    if (!showOTPSection && !showEmailInput && typeof window !== "undefined") {
      makeFreshRecaptcha().catch(() =>
        setError("Security check failed to initialize. Refresh and try again.")
      );
    }
    return () => {
      try { window.__cbRecaptcha?.clear?.(); } catch {}
    };
  }, [showOTPSection, showEmailInput]);

  // Resend OTP countdown
  useEffect(() => {
    let timer;
    if (disableResend && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0) {
      setCountdown(RESEND_TIMER);
      setDisableResend(false);
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [disableResend, countdown]);

  // Load user from localStorage if present
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      dispatch(loginSuccess({ user: userData, status: "authenticated" }));
    }
  }, [dispatch]);

  const onSendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      if (!window.__cbRecaptcha) await makeFreshRecaptcha();

      // 👇 always create/refresh a token before sending
      await window.__cbRecaptcha.verify();

      const confirmation = await signInWithPhoneNumber(
        auth,
        phone,                 // must be E.164 like "+9198…"
        window.__cbRecaptcha
      );
      setConfirmationResult(confirmation);
      setShowOTPSection(true);
      setDisableResend(true);
      setCountdown(RESEND_TIMER);
      resetOtp();
    } catch (err) {
      console.error("OTP send error:", err);
      const code = err?.code || "";
      let msg = "Failed to send OTP.";
      if (code.includes("invalid-recaptcha") || code.includes("captcha-check-failed"))
        msg = "Security check failed. Please refresh the page and try again.";
      else if (code.includes("too-many-requests")) msg = "Too many requests, try again later.";
      else if (code.includes("quota-exceeded")) msg = "SMS quota exceeded.";
      else if (code.includes("invalid-phone-number")) msg = "Invalid phone number.";
      setError(msg);

      try { window.__cbRecaptcha?.clear?.(); } catch {}
      await makeFreshRecaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setLoading(true);
    try {
      await makeFreshRecaptcha();
      const confirmation = await signInWithPhoneNumber(
        auth,
        phone,
        window.__cbRecaptcha
      );
      setConfirmationResult(confirmation);
      setDisableResend(true);
      setCountdown(RESEND_TIMER);
      resetOtp({ otp: "" });
    } catch {
      setError("Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitOTP = async (data) => {
    setLoading(true);
    setError("");
    if (!confirmationResult) {
      setError("No OTP confirmation found. Request a new OTP.");
      setLoading(false);
      return;
    }
    try {
      const result = await confirmationResult.confirm(data.otp);
      const user = result.user;
      const idToken = await user.getIdToken();

      const response = await verifyOtpApiHandler({
        idToken,
        phone_number: user.phoneNumber,
      });

      if (response.data && response.data.message === "Email required") {
        resetOtp();
        setShowOTPSection(false);
        setShowEmailInput(true);
        setOtpStepData({ idToken, phoneNumber: user.phoneNumber });
        setLoading(false);
        setInfoMessage(
          "No account was found for this phone number. Please provide your email to continue registration."
        );
        return;
      }

      if (
        response.data &&
        response.data.message &&
        response.data.message.includes("verify your email")
      ) {
        setShowEmailInput(false);
        setShowOTPSection(false);
        setOtpStepData({});
        setPhone("");
        resetPhone();
        resetOtp();
        setLoading(false);
        setRegistrationSuccessMessage(
          "Registration successful! Please check your inbox to verify your email before you can login."
        );
        return;
      }

      if (response.data && response.data.user) {
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        dispatch(
          loginSuccess({ user: response.data.user, status: "authenticated" })
        );
        redirectAfterLogin(router, response.data.user);
        return;
      }

      setError("Unexpected response. Please try again.");
      setLoading(false);
    } catch (err) {
      if (
        err?.response?.status === 403 &&
        err?.response?.data?.message &&
        err.response.data.message.toLowerCase().includes("not verified")
      ) {
        setShowEmailInput(false);
        setShowOTPSection(false);
        setOtpStepData({});
        setPhone("");
        resetPhone();
        resetOtp();
        resetEmail && resetEmail();
        setRegistrationSuccessMessage(err.response.data.message);
        setLoading(false);
        return;
      }
      setError(
        err?.response?.data?.message || err?.message || "Failed to verify OTP."
      );
      setLoading(false);
    }
  };

  const onSubmitEmail = async (data) => {
    setLoading(true);
    setError("");
    try {
      const response = await verifyOtpApiHandler({
        idToken: otpStepData.idToken,
        phone_number: otpStepData.phoneNumber,
        email: data.email,
      });

      if (
        response.data?.message &&
        response.data.message.includes("verify your email")
      ) {
        setShowEmailInput(false);
        setShowOTPSection(false);
        setOtpStepData({});
        setPhone("");
        resetPhone();
        resetOtp();
        resetEmail();
        setLoading(false);
        setRegistrationSuccessMessage(
          "Registration successful! Please check your inbox to verify your email before you can login."
        );
        return;
      }

      if (response.data && response.data.user) {
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        dispatch(
          loginSuccess({ user: response.data.user, status: "authenticated" })
        );
        redirectAfterLogin(router, response.data.user);
        return;
      }

      setError("Unexpected response. Please try again.");
      setLoading(false);
    } catch (err) {
      if (
        err?.response?.status === 403 &&
        err?.response?.data?.message &&
        err.response.data.message.toLowerCase().includes("not verified")
      ) {
        setShowEmailInput(false);
        setShowOTPSection(false);
        setOtpStepData({});
        setPhone("");
        resetPhone();
        resetOtp();
        resetEmail && resetEmail();
        setRegistrationSuccessMessage(err.response.data.message);
        setLoading(false);
        return;
      }
      setError(
        err?.response?.data?.message || err?.message || "Failed to verify OTP."
      );
      setLoading(false);
    }
  };

  const handleLinkPhone = async (emailValue) => {
    setLoading(true);
    setError("");
    try {
      const response = await linkPhoneApiHandler({
        idToken: otpStepData.idToken,
        email: emailValue,
        phone_number: otpStepData.phoneNumber,
      });
      localStorage.setItem("userData", JSON.stringify(response.data.user));
      dispatch(loginSuccess({ user: response.data.user, status: "authenticated" }));
      redirectAfterLogin(router, response.data.user);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to link phone.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeNumber = () => {
    setShowOTPSection(false);
    setConfirmationResult(null);
    setError("");
    setPhone("");
    resetPhone();
    resetOtp();
  };

  return (
    <Fragment>
      <Head>
        <title>Cadbull | Register</title>
        <meta name="description" content="World Largest 2d CAD Library." />
      </Head>
      <AuthLayout title={pageTitle.title} description={pageTitle.description}>
        {registrationSuccessMessage ? (
          <div className="alert alert-success text-center my-5" style={{ fontSize: "1.1rem" }}>
            {registrationSuccessMessage}
            <br />
            <Link href="/auth/login" className="btn btn-primary mt-3">
              Go to Login
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {/* Phone form */}
            {!showOTPSection && !showEmailInput && (
              <form onSubmit={handlePhoneSubmit(onSendOtp)} className="row g-3 mb-3 mb-md-4">
                <div className="col-lg-12">
                  <div className="d-flex gap-2 align-items-center mb-1">
                    <label>Mobile Number</label>
                  </div>
                  <div className="col-lg-12">
                    <PhoneInput
                      country={"in"}
                      value={phone}
                      onChange={(val) => setPhone("+" + val.replace(/^\+/, ""))}
                      enableSearch
                      inputProps={{
                        name: "mobile",
                        required: true,
                        className: "form-control",
                        autoFocus: true,
                      }}
                      inputStyle={{ width: "100%" }}
                    />
                  </div>
                </div>

                {/* IMPORTANT: the ONLY recaptcha container */}
                <div className="col-lg-12">
                  <div id="recaptcha-container" style={{ marginTop: "10px" }} />
                </div>

                <div className="col-lg-12">
                  <div className="mt-2 mt-md-3">
                    <button
                      type="submit"
                      className="btn btn-lg btn-secondary w-100"
                      disabled={loading || !recaptchaVerifier}
                    >
                      {loading ? "Sending..." : "Send OTP"}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* OTP form */}
            {showOTPSection && !showEmailInput && (
              <form onSubmit={handleOtpSubmit(onSubmitOTP)} className="row g-3 mb-3 mb-md-4">
                <div className="col-lg-12">
                  <div className="mt-2 text-center">
                    <p>
                      Please enter the OTP sent to <span className="fw-bold">{phone}</span>
                      <br />
                      <button type="button" className="btn btn-link p-0" onClick={handleChangeNumber}>
                        Change Number
                      </button>
                    </p>
                  </div>
                  <Controller
                    name="otp"
                    control={controlOtp}
                    rules={{
                      required: "OTP is required",
                      minLength: { value: 6, message: "OTP must be 6 digits" },
                      maxLength: { value: 6, message: "OTP must be 6 digits" },
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`form-control ${errorsOtp?.otp ? "is-invalid" : ""}`}
                        placeholder="Enter 6-digit OTP"
                        maxLength="6"
                        pattern="[0-9]{6}"
                        autoFocus
                      />
                    )}
                  />
                  {errorsOtp?.otp && <div className="invalid-feedback">{errorsOtp.otp.message}</div>}
                </div>

                <div className="col-lg-12">
                  <div className="mt-2 mt-md-3">
                    <button type="submit" className="btn btn-lg btn-secondary w-100" disabled={loading}>
                      {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                  </div>
                  <div className="mt-2 text-center">
                    <p>
                      {disableResend ? (
                        <span>
                          Not received your code? 00:
                          {countdown < 10 ? `0${countdown}` : countdown}
                        </span>
                      ) : (
                        <>
                          <span>Not received your code? </span>
                          <button
                            type="button"
                            className="btn btn-link p-0"
                            onClick={handleResendCode}
                            disabled={disableResend || loading}
                          >
                            Resend code
                          </button>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </form>
            )}

            {/* Email Input Step */}
            {showEmailInput && (
              <>
                {infoMessage && <div className="alert alert-info mb-2">{infoMessage}</div>}
                <form onSubmit={handleEmailSubmit(onSubmitEmail)} className="row g-3 mb-3">
                  <div className="col-lg-12">
                    <label>Email Address</label>
                    <input
                      {...registerEmail("email", {
                        required: "Email is required",
                        pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: "Please enter a valid email" },
                      })}
                      type="email"
                      className={`form-control ${emailErrors?.email ? "is-invalid" : ""}`}
                      placeholder="Enter your email"
                      autoFocus
                    />
                    {emailErrors?.email && (
                      <div className="invalid-feedback">{emailErrors.email.message}</div>
                    )}
                  </div>
                  <div className="col-lg-12">
                    <button type="submit" className="btn btn-lg btn-secondary w-100" disabled={loading}>
                      {loading ? "Linking..." : "Submit Email"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {error ===
              "Email exists. Please use email login or link your phone to this account." && (
              <div className="mb-3">
                <button
                  className="btn btn-primary w-100"
                  disabled={loading}
                  onClick={() => handleLinkPhone(getEmailValues("email"))}
                  type="button"
                >
                  {loading ? "Linking..." : "Link Phone to Account"}
                </button>
              </div>
            )}
          </>
        )}
      </AuthLayout>
    </Fragment>
  );
};

RegisterPhone.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default RegisterPhone;
