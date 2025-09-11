import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import Head from "next/head";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../../redux/app/features/authSlice";
import { auth } from "@/utils/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { verifyOtpApiHandler, linkPhoneApiHandler } from "@/service/api";
import api from "@/service/api"
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { redirectAfterLogin } from "@/utils/redirectHelpers";
import SimpleCaptcha from "@/components/SimpleCaptcha";

// 🛡️ Bot Protection Utilities
const validatePhoneNumber = (phone) => {
  if (!phone || phone.length < 10) return false;
  if (phone.length > 15) return false;
  // Check for obvious patterns
  const patterns = [
    /^(\+?1{10,})$/, // All 1s
    /^(\+?0{10,})$/, // All 0s
    /^(\+?9{10,})$/, // All 9s
    /^(\+?1234567890)$/, // Sequential
  ];
  return !patterns.some(pattern => pattern.test(phone.replace(/\s+/g, '')));
};

const generateNonce = () => {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2, '0')).join('');
};

// 🍯 Advanced Honeypot Detection
const detectBotBehavior = (honeypotValue, formSubmissionTime) => {
  // Check if honeypot field is filled
  if (honeypotValue.trim() !== '') {
    return { isBot: true, reason: 'honeypot_filled', details: honeypotValue };
  }
  
  // Check if form was submitted too quickly (less than 2 seconds)
  const currentTime = Date.now();
  const submissionTime = currentTime - formSubmissionTime;
  if (submissionTime < 2000) {
    return { isBot: true, reason: 'too_fast_submission', details: `${submissionTime}ms` };
  }
  
  // Check for suspicious user agent patterns
  const userAgent = navigator.userAgent.toLowerCase();
  const botPatterns = [
    'bot', 'crawler', 'spider', 'scraper', 'headless', 'phantom', 'selenium',
    'automated', 'test', 'curl', 'wget', 'python', 'requests'
  ];
  
  for (const pattern of botPatterns) {
    if (userAgent.includes(pattern)) {
      return { isBot: true, reason: 'suspicious_user_agent', details: userAgent };
    }
  }
  
  // Check for missing browser features
  if (typeof window !== 'undefined') {
    if (!window.navigator.webdriver === undefined && window.navigator.webdriver) {
      return { isBot: true, reason: 'webdriver_detected', details: 'automation_detected' };
    }
    
    // Check for headless browser indicators
    if (window.outerHeight === 0 || window.outerWidth === 0) {
      return { isBot: true, reason: 'headless_browser', details: `${window.outerWidth}x${window.outerHeight}` };
    }
  }
  
  return { isBot: false, reason: null };
};


const pageTitle = {
  title: "Register A New Account",
  description: "Choose from 254195+ Free & Premium CAD Files with new additions published every second month",
};
const RESEND_TIMER = 30;

const RegisterPhone = () => {
  // Forms: one for phone, one for OTP
  const { handleSubmit: handlePhoneSubmit, control: controlPhone, reset: resetPhone, formState: { errors: errorsPhone } } = useForm();
  const { handleSubmit: handleOtpSubmit, control: controlOtp, reset: resetOtp, formState: { errors: errorsOtp } } = useForm();

  const router = useRouter();
  const dispatch = useDispatch();

  // State
  const [showOTPSection, setShowOTPSection] = useState(false);
  const [disableResend, setDisableResend] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_TIMER);
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [otpStepData, setOtpStepData] = useState({}); // Store idToken, phoneNumber for next step
  const { handleSubmit: handleEmailSubmit, register: registerEmail, formState: { errors: emailErrors }, reset: resetEmail, getValues: getEmailValues } = useForm();
  const [registrationSuccessMessage, setRegistrationSuccessMessage] = useState("");

  const [phone, setPhone] = useState(""); // phone will be in '919999999999' format, you prepend "+"

  // 🛡️ Bot Protection States
  const [botProtectionPassed, setBotProtectionPassed] = useState(false);
  const [sessionNonce, setSessionNonce] = useState('');
  const [rateLimitStatus, setRateLimitStatus] = useState(null);
  const [simpleCaptchaPassed, setSimpleCaptchaPassed] = useState(false);
  const [honeypotValue, setHoneypotValue] = useState(''); // 🍯 Honeypot for bot detection
  const [formLoadTime, setFormLoadTime] = useState(Date.now()); // Track form load time

  // Recaptcha load only once
  const recaptchaLoaded = useRef(false);
  const lastRequestTime = useRef(0);

  // 🛡️ Initialize Bot Protection on Mount
  useEffect(() => {
    const nonce = generateNonce();
    setSessionNonce(nonce);
  }, []);

  // 🔥 Firebase reCAPTCHA Enterprise Setup (ENFORCE Mode Compatible)
  useEffect(() => {
    // Only initialize when on phone form (not OTP, not Email)
    if (!showOTPSection && !showEmailInput) {
      recaptchaLoaded.current = false;
      setRecaptchaVerifier(null);
      
      if (typeof window !== "undefined") {
        try {
          const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "normal",
            callback: (response) => {
              console.log("✅ reCAPTCHA solved successfully");
              setBotProtectionPassed(true);
            },
            "expired-callback": () => {
              console.warn("⚠️ reCAPTCHA expired");
              setError("Security verification expired. Please try again.");
              setBotProtectionPassed(false);
            },
            "error-callback": (error) => {
              console.error("❌ reCAPTCHA error:", error);
              setError("Security verification failed. Please refresh and try again.");
              setBotProtectionPassed(false);
            }
          });
          
          setRecaptchaVerifier(verifier);
          verifier.render().then(() => {
            console.log("🔥 reCAPTCHA Enterprise rendered successfully");
            recaptchaLoaded.current = true;
          }).catch((error) => {
            console.error("❌ reCAPTCHA render error:", error);
            setError("Security verification failed to load. Please refresh the page.");
          });
          
        } catch (err) {
          console.error("❌ reCAPTCHA initialization error:", err);
          setError("Security verification failed to initialize. Please refresh the page.");
        }
      }
    }
    
    return () => {
      try {
        if (recaptchaVerifier && typeof recaptchaVerifier.clear === "function") {
          recaptchaVerifier.clear();
        }
      } catch (err) {
        console.warn("Warning clearing recaptcha:", err);
      }
    };
  }, [showOTPSection, showEmailInput]);


  // Resend OTP countdown
  useEffect(() => {
    let timer;
    if (disableResend && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (countdown === 0) {
      setCountdown(RESEND_TIMER);
      setDisableResend(false);
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [disableResend, countdown]);

  // On login, auto-load
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      dispatch(loginSuccess({ user: userData, status: "authenticated" }));
    }
  }, [dispatch]);

  // E.164 phone format
  const formatPhoneNumber = (number) => {
    let n = number.trim().replace(/\D/g, "");
    if (!number.startsWith("+")) {
      if (n.length === 10) return "+91" + n;
      return "+" + n;
    }
    return number;
  };

  // 🛡️ Bot Protection: Rate Limiting Check
  const checkRateLimit = () => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime.current;
    
    // Enforce minimum 3 seconds between requests
    if (timeSinceLastRequest < 3000) {
      const waitTime = Math.ceil((3000 - timeSinceLastRequest) / 1000);
      throw new Error(`Please wait ${waitTime} seconds before trying again.`);
    }
    
    lastRequestTime.current = now;
    return true;
  };

  // 🔥 Enhanced Phone form submit with multi-layer protection
  const onSendOtp = async (data) => {
    setError("");
    setLoading(true);
    
    try {
      // 🍯 Layer 0: Advanced Bot Detection (Most Effective!)
      const botCheck = detectBotBehavior(honeypotValue, formLoadTime);
      if (botCheck.isBot) {
        console.warn(`🚨 Bot detected: ${botCheck.reason}`, {
          honeypotValue,
          submissionSpeed: Date.now() - formLoadTime,
          userAgent: navigator.userAgent
        });
        
        // Don't show specific error to bot - just generic message
        await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 2000)); // Random delay
        setError("Service temporarily unavailable. Please try again later.");
        setLoading(false);
        return;
      }
      
      // 🛡️ Layer 1: Rate Limiting
      checkRateLimit();
      
      // 🛡️ Layer 2: Phone Validation
      if (!validatePhoneNumber(phone)) {
        throw new Error("Invalid phone number format detected.");
      }
      
      // 🛡️ Layer 3: Simple CAPTCHA Check
      if (!simpleCaptchaPassed) {
        throw new Error("Please complete the image verification below.");
      }
      
      // 🛡️ Layer 4: reCAPTCHA Verification
      if (!recaptchaVerifier) {
        throw new Error("Security verification not ready. Please wait...");
      }
      
      if (!botProtectionPassed) {
        throw new Error("Please complete the security verification first.");
      }

      // 🛡️ Layer 5: Backend Bot Protection Check
      try {
        await api.post("/otp-preflight/check-eligibility", { 
          phone_number: phone,
          nonce: sessionNonce 
        });
      } catch (preflightError) {
        if (preflightError.response?.status === 429) {
          throw new Error("Too many requests. Please try again later.");
        }
        throw new Error("Security check failed. Please try again.");
      }

      // 🔥 Firebase OTP Send (Compatible with ENFORCE mode)
      const formattedPhone = phone;
      if (!formattedPhone || formattedPhone.length < 8) {
        throw new Error("Please enter a valid phone number.");
      }
      
      console.log("🚀 Sending OTP via Firebase reCAPTCHA Enterprise...");
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);

      setConfirmationResult(confirmation);
      setPhone(formattedPhone);
      setShowOTPSection(true);
      setDisableResend(true);
      setCountdown(RESEND_TIMER);
      resetOtp();
      
      console.log("✅ OTP sent successfully");
      
    } catch (err) {
      console.error("❌ OTP send error:", err);
      
      let errorMessage = "Failed to send OTP. ";
      
      if (err.code === "auth/invalid-phone-number") {
        errorMessage = "Invalid phone number format.";
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please try again later.";
      } else if (err.code === "auth/quota-exceeded") {
        errorMessage = "SMS quota exceeded. Please try again later.";
      } else if (err.code === "auth/invalid-recaptcha-token") {
        errorMessage = "Security verification failed. Please refresh and try again.";
        setBotProtectionPassed(false);
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      // Reset reCAPTCHA on error
      if (recaptchaVerifier) {
        try {
          recaptchaVerifier.clear();
          setBotProtectionPassed(false);
          setTimeout(() => {
            if (recaptchaVerifier) {
              recaptchaVerifier.render().catch(console.error);
            }
          }, 1000);
        } catch (clearError) {
          console.warn("Error clearing reCAPTCHA:", clearError);
        }
      }
    }
    
    setLoading(false);
  };

  // 🔥 Enhanced Resend OTP with protection
  const handleResendCode = async () => {
    setError("");
    setLoading(true);
    
    try {
      // 🛡️ Rate limiting for resend
      checkRateLimit();
      
      if (!recaptchaVerifier) {
        throw new Error("Security verification not ready. Please refresh the page.");
      }
      
      if (!validatePhoneNumber(phone)) {
        throw new Error("Invalid phone number detected.");
      }
      
      console.log("🔄 Resending OTP...");
      const confirmation = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
      
      setConfirmationResult(confirmation);
      setDisableResend(true);
      setCountdown(RESEND_TIMER);
      resetOtp({ otp: "" });
      
      console.log("✅ OTP resent successfully");
      
    } catch (err) {
      console.error("❌ Resend error:", err);
      setError(err.message || "Failed to resend OTP. Please try again.");
    }
    
    setLoading(false);
  };

  // OTP verify
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
      // POST to backend!
      // onSubmitOTP
      const response = await verifyOtpApiHandler({
        idToken,
        phone_number: user.phoneNumber,
      });

      // If backend says email needed, show email input form (NO REDIRECT)
      if (response.data && response.data.message === "Email required") {
        resetOtp();
        setShowOTPSection(false);
        setShowEmailInput(true);
        setOtpStepData({ idToken, phoneNumber: user.phoneNumber });
        setLoading(false);
        setInfoMessage("No account was found for this phone number. Please provide your email to continue registration.");
        return;
      }

      // If backend says "verify your email", show info message (NO REDIRECT)
      if (response.data && response.data.message && response.data.message.includes("verify your email")) {
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

      // Only if response.data.user is present, continue with login!
      if (response.data && response.data.user) {
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        dispatch(loginSuccess({ user: response.data.user, status: "authenticated" }));
        
        // Use redirect helper for consistent redirect logic
        redirectAfterLogin(router, response.data.user);
        return;
      }

      // Fallback for unexpected cases:
      setError("Unexpected response. Please try again.");
      setLoading(false);


    } 
    // catch (err) {
    //   // setError(
    //   //   err?.response?.data?.message ||
    //   //   "Failed to verify OTP."
    //   // );
    //   // 👇 Add this for detailed error info
    //   console.error('OTP verification error:', err);
    //   setError(
    //     err?.message ||
    //     err?.response?.data?.message ||
    //     "Failed to verify OTP."
    //   );
    // }
    // setLoading(false);
    catch (err) {
      // Handle "email not verified" with info message, NOT error
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
        resetEmail && resetEmail(); // just in case

        // Show info instead of error (styled in a different color if you want)
        setRegistrationSuccessMessage(err.response.data.message);
        setLoading(false);
        return;
      }

      // Fallback for other errors
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to verify OTP."
      );
      setLoading(false);
    }

  };


  const onSubmitEmail = async (data) => {
    setLoading(true);
    setError("");
    try {
      // Send email + OTP info to backend
      const response = await verifyOtpApiHandler({
        idToken: otpStepData.idToken,
        phone_number: otpStepData.phoneNumber,
        email: data.email,
      });
      // 👇 This message means user must verify their email, DO NOT LOGIN YET!
      // If backend says verify your email (no redirect!)
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

      // Only proceed if user object is present
      if (response.data && response.data.user) {
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        dispatch(loginSuccess({ user: response.data.user, status: "authenticated" }));
        
        // Use redirect helper for consistent redirect logic
        redirectAfterLogin(router, response.data.user);
        return;
      }

      setError("Unexpected response. Please try again.");
      setLoading(false);

    } 
    // catch (err) {
    //   setError(
    //     err?.response?.data?.message ||
    //     "Failed to link email."
    //   );
    // }
    // setLoading(false);
    catch (err) {
      // Handle "email not verified" with info message, NOT error
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
        resetEmail && resetEmail(); // just in case

        // Show info instead of error (styled in a different color if you want)
        setRegistrationSuccessMessage(err.response.data.message);
        setLoading(false);
        return;
      }

      // Fallback for other errors
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to verify OTP."
      );
      setLoading(false);
    }

  };

  const handleLinkPhone = async (emailValue) => {
    setLoading(true);
    setError("");
    try {
      const response = await linkPhoneApiHandler ({
        idToken: otpStepData.idToken,
        email: emailValue,
        phone_number: otpStepData.phoneNumber,
      });
      // console.log("Link phone success:", response.data);
      localStorage.setItem("userData", JSON.stringify(response.data.user));
      dispatch(loginSuccess({ user: response.data.user, status: "authenticated" }));
      
      // Use redirect helper for consistent redirect logic
      redirectAfterLogin(router, response.data.user);
    } catch (err) {
      console.error("Link phone error:", err, err?.response?.data);
      setError(
        err?.response?.data?.message ||
        "Failed to link phone."
      );
    }
    setLoading(false);
  };





  // Change number
  const handleChangeNumber = () => {
    setShowOTPSection(false);
    setConfirmationResult(null);
    setError('');
    setPhone("");
    resetPhone();
    resetOtp();
    recaptchaLoaded.current = false;
    
    // 🛡️ Reset all security states
    setBotProtectionPassed(false);
    setSimpleCaptchaPassed(false);
    setHoneypotValue(''); // Reset honeypot
    setSessionNonce(generateNonce());
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
        {error && <div className="alert alert-danger" role="alert">{error}</div>}

        {/* Phone form */}
        {!showOTPSection && !showEmailInput && (
          <div className="row g-3 mb-3 mb-md-4">
            <form onSubmit={handlePhoneSubmit(onSendOtp)} className="w-100">
              
              {/* 🍯 Advanced Honeypot Fields - Multiple traps for different bot types */}
              <div style={{ 
                position: 'absolute', 
                left: '-9999px', 
                width: '1px', 
                height: '1px', 
                overflow: 'hidden',
                opacity: 0,
                pointerEvents: 'none',
                tabIndex: -1
              }}>
                {/* Trap 1: Common form field name that bots auto-fill */}
                <label htmlFor="website">Website:</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={honeypotValue}
                  onChange={(e) => setHoneypotValue(e.target.value)}
                  autoComplete="off"
                  tabIndex="-1"
                  placeholder="Leave this field empty"
                />
                
                {/* Trap 2: Another common bot target */}
                <input
                  type="email"
                  name="email_confirm"
                  autoComplete="off"
                  tabIndex="-1"
                  style={{ display: 'none' }}
                />
                
                {/* Trap 3: Hidden URL field */}
                <input
                  type="url"
                  name="homepage"
                  autoComplete="off"
                  tabIndex="-1"
                  style={{ display: 'none' }}
                />
              </div>
              
              <div className="col-lg-12 mb-3">
                <div className="d-flex gap-2 align-items-center mb-1">
                  <label>Mobile Number</label>
                </div>
                <PhoneInput
                  country={'in'} // Default to India or use geo-detect for user's country
                  value={phone}
                  onChange={val => setPhone('+' + val.replace(/^\+/, ''))}
                  enableSearch
                  inputProps={{
                    name: 'mobile',
                    required: true,
                    className: 'form-control',
                    autoFocus: true,
                  }}
                  inputStyle={{ width: "100%" }}
                  // Optional: onlyCountries={['us', 'in', 'ae', ...]}
                />
              </div>
              
              {/* 🛡️ Simple CAPTCHA Layer */}
              <div className="col-lg-12 mb-3">
                <SimpleCaptcha
                  onVerify={(isVerified) => {
                    setSimpleCaptchaPassed(isVerified);
                    if (!isVerified) {
                      setError("Please solve the math problem correctly.");
                    } else {
                      setError(""); // Clear any previous errors
                    }
                  }}
                />
              </div>
              
              <div className="col-lg-12 mb-3">
                <div id="recaptcha-container" style={{ marginTop: '10px' }}></div>
                {/* 🛡️ Security Status Indicator */}
                {recaptchaLoaded.current && (
                  <div className="mt-2">
                    <small className={`text-${botProtectionPassed ? 'success' : 'muted'}`}>
                      {botProtectionPassed ? (
                        <>
                          <i className="fas fa-shield-alt me-1"></i>
                          Security verification completed
                        </>
                      ) : (
                        <>
                          <i className="fas fa-shield-alt me-1"></i>
                          Please complete security verification above
                        </>
                      )}
                    </small>
                  </div>
                )}
              </div>
              
              <div className="col-lg-12">
                <div className="mt-2 mt-md-3">
                  <button
                    type="submit"
                    className="btn btn-lg btn-secondary w-100"
                    disabled={loading || !recaptchaVerifier || !botProtectionPassed || !simpleCaptchaPassed || honeypotValue !== ''}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Sending...
                      </>
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                  
                  {/* 🛡️ Security Requirements Status */}
                  <div className="mt-2">
                    <small className="text-muted d-block">
                      Security Requirements:
                    </small>
                    <div className="small">
                      <div className={`text-${honeypotValue === '' ? 'success' : 'danger'}`}>
                        {honeypotValue === '' ? '✓' : '⚠'} Bot detection
                      </div>
                      <div className={`text-${simpleCaptchaPassed ? 'success' : 'muted'}`}>
                        {simpleCaptchaPassed ? '✓' : '○'} Math verification
                      </div>
                      <div className={`text-${botProtectionPassed ? 'success' : 'muted'}`}>
                        {botProtectionPassed ? '✓' : '○'} reCAPTCHA verification
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* OTP form */}
        {showOTPSection && !showEmailInput && (
          <div className="row g-3 mb-3 mb-md-4">
            <form onSubmit={handleOtpSubmit(onSubmitOTP)} className="w-100">
              <div className="col-lg-12 mb-3">
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
                    maxLength: { value: 6, message: "OTP must be 6 digits" }
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={`form-control ${errorsOtp.otp ? "is-invalid" : ""}`}
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                      pattern="[0-9]{6}"
                      autoFocus
                    />
                  )}
                />
                {errorsOtp.otp && <div className="invalid-feedback">{errorsOtp.otp.message}</div>}
              </div>
              <div className="col-lg-12 mb-3">
                <div id="recaptcha-container" style={{ marginTop: '10px' }} />
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
                      <span>Not received your code? 00:{countdown < 10 ? `0${countdown}` : countdown}</span>
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
          </div>
        )}

        {/* Email Input Step (only shown when backend says "Email required") */}
        {showEmailInput && (
          <>
          {infoMessage && (
            <div className="alert alert-info mb-2">{infoMessage}</div>
          )}
          <div className="row g-3 mb-3">
            <form onSubmit={handleEmailSubmit(onSubmitEmail)} className="w-100">
              <div className="col-lg-12 mb-3">
                <label>Email Address</label>
                <input
                  {...registerEmail("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                      message: "Please enter a valid email"
                    }
                  })}
                  type="email"
                  className={`form-control ${emailErrors.email ? "is-invalid" : ""}`}
                  placeholder="Enter your email"
                  autoFocus
                />
                {emailErrors.email && (
                  <div className="invalid-feedback">{emailErrors.email.message}</div>
                )}
              </div>
              <div className="col-lg-12">
                <button type="submit" className="btn btn-lg btn-secondary w-100" disabled={loading}>
                  {loading ? "Linking..." : "Submit Email"}
                </button>
              </div>
            </form>
          </div>
          </>
        )}

        {error === "Email exists. Please use email login or link your phone to this account." && (
          <div className="mb-3">
            <button
              className="btn btn-primary w-100"
              disabled={loading}
              onClick={() => handleLinkPhone(getEmailValues("email"))} // Pass current email value!
              type="button"
            >
              {loading ? "Linking..." : "Link Phone to Account"}
            </button>
          </div>
        )}



        <div className="mt-4 d-flex flex-column flex-xl-row gap-3 gap-xl-2 mb-3 mb-md-4">
          {/* Social login buttons here if needed */}
        </div>
        <div className="text-center">
          <p>
            <span>Already Signed Up?</span>{" "}
            <Link href="/auth/login" className="text-danger">
              Login your account.
            </Link>
          </p>
        </div>
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
