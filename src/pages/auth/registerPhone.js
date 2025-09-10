import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
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
import { removeClassicRecaptcha } from "@/utils/recaptchaClassicCleanup";

const pageTitle = {
  title: "Register A New Account",
  description:
    "Choose from 254195+ Free & Premium CAD Files with new additions published every second month",
};
const RESEND_TIMER = 30;

// --- Recaptcha singleton (module scope, persists across renders) ---
// --- Singleton state (module scope) ---
let rv = null;                // RecaptchaVerifier
let rvReadyPromise = null;    // Promise from the first render()
let holderId = null;          // id of the hidden container div

function cleanupRecaptcha() {
  try { rv?.clear?.(); } catch {}
  if (holderId) {
    const old = document.getElementById(holderId);
    if (old && old.parentNode) old.parentNode.removeChild(old);
  }
  rv = null;
  rvReadyPromise = null;
  holderId = null;
}
// Back-compat: some old code or stale bundles may still call resetRv().
// Point it to the real cleanup so unmount never crashes.
function resetRv() { cleanupRecaptcha(); }

function ensureRv(onExpired) {
  if (rv) return rv;

  // 1) make a fresh, unique holder every time we (re)create
  holderId = `cb-recaptcha-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const holder = document.createElement("div");
  holder.id = holderId;
  holder.style.display = "none";
  document.body.appendChild(holder);

  console.log("making new verifier in", holderId, "has childNodes?", !!document.getElementById(holderId)?.childNodes?.length);

  // 2) create the verifier against the *id string*
  rv = new RecaptchaVerifier(auth, holderId, {
    size: "invisible",
    callback: () => {},
    "expired-callback": onExpired,
  });

  // 3) render exactly once and remember the promise
  rvReadyPromise = rv.render().catch((e) => {
    // if render fails (e.g., “already rendered”), nuke and bubble up
    cleanupRecaptcha();
    throw e;
  });
  return rv;
}

async function getRvReady(onExpired) {
  const verifier = ensureRv(onExpired);
  if (rvReadyPromise) await rvReadyPromise; // wait for first render to settle
  return verifier;
}

// Call when leaving the phone page to allow classic to load again
function allowClassicBack() {
  if (typeof window === "undefined") return;
  try {
    // If enterprise is present, remove it so classic can load fresh
    if (window.grecaptcha?.enterprise) {
      // Remove enterprise script tags (defensive)
      document.querySelectorAll('script[src*="recaptcha/enterprise"]').forEach(s => s.remove());
      // Drop the grecaptcha ref so react-google-recaptcha injects classic
      try { delete window.grecaptcha; } catch { window.grecaptcha = undefined; }
    }
    // If the classic script isn’t there, we can let react-google-recaptcha inject it,
    // but adding this is harmless and avoids timing races:
    const hasClassic = !!document.querySelector('script[src^="https://www.google.com/recaptcha/api.js"]');
    if (!hasClassic) {
      const s = document.createElement("script");
      s.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      s.async = true; s.defer = true;
      document.head.appendChild(s);
    }
  } catch {}
}


const RegisterPhone = () => {
  const { handleSubmit: handlePhoneSubmit, reset: resetPhone } = useForm();
  const { handleSubmit: handleOtpSubmit, control: controlOtp, reset: resetOtp, formState: { errors: errorsOtp } } = useForm({ defaultValues: { otp: '' } });
  const { handleSubmit: handleEmailSubmit, register: registerEmail, formState: { errors: emailErrors }, reset: resetEmail, getValues: getEmailValues } = useForm({ defaultValues: { email: '' } });

  const router = useRouter();
  const dispatch = useDispatch();

  const [showOTPSection, setShowOTPSection] = useState(false);
  const [disableResend, setDisableResend] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_TIMER);
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [otpStepData, setOtpStepData] = useState({});
  const [registrationSuccessMessage, setRegistrationSuccessMessage] = useState("");
  const [phone, setPhone] = useState("");

  // Blocks late-injected classic v2 reCAPTCHA so Firebase can load enterprise.
  useEffect(() => {
    const nukeClassic = () => {
      // Remove any old v2 script tags that appear
      document
        .querySelectorAll('script[src^="https://www.google.com/recaptcha/api.js"]')
        .forEach(s => s.parentElement && s.parentElement.removeChild(s));

      // If a classic grecaptcha leaked into window, wipe it so enterprise can load
      if (typeof window !== "undefined") {
        const gre = window.grecaptcha;
        if (gre && !gre.enterprise) {
          try { delete window.grecaptcha; } catch { window.grecaptcha = undefined; }
        }
      }
    };

    // run now…
    nukeClassic();

    // …and keep watching in case something injects it later
    const obs = new MutationObserver(nukeClassic);
    obs.observe(document.documentElement, { childList: true, subtree: true });

    return () => obs.disconnect();
  }, []);

  // 1) Classic-nuker effect
  // useEffect(() => {
  //   const obs = new MutationObserver(nukeClassic);
  //   obs.observe(document.documentElement, { childList: true, subtree: true });
  //   return () => { obs.disconnect(); /* no need to call allowClassicBack here */ };
  // }, []);

  // Create Enterprise verifier once
  // 2) Enterprise verifier effect
  useEffect(() => {
    removeClassicRecaptcha();
    getRvReady(() => setError("Security check expired, please try again."))
    .catch(() => {}); // ignore errors here, will be handled later
    // return () => resetRv();
    return () => {
      cleanupRecaptcha();    // or resetRv();
      allowClassicBack();    // ✅ hand control back to classic
    };
  }, []);

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

  // SEND OTP
  const onSendOtp = async () => {
    setError(""); setLoading(true);
    try {
      const verifier = await getRvReady(() => setError("Security check expired, please try again."));
      await verifier.verify(); // get fresh token
      // Always verify (gets a fresh token internally)
      const confirmation = await signInWithPhoneNumber(auth, phone, verifier);

      setConfirmationResult(confirmation);
      setShowOTPSection(true);
      setDisableResend(true);
      setCountdown(RESEND_TIMER);
      resetOtp();
    } catch (err) {
      console.error("OTP send error:", err?.code, err?.message, err);
      const code = err?.code || "";
      setError(
        /invalid-recaptcha|captcha-check-failed/.test(code) ? "Security check failed. Please refresh the page and try again."
        : /too-many-requests/.test(code) ? "Too many requests, try again later."
        : /quota-exceeded/.test(code) ? "SMS quota exceeded."
        : /invalid-phone-number/.test(code) ? "Invalid phone number."
        : "Failed to send OTP."
      );
      // resetRv(); // clean up the *module-level* instance
      cleanupRecaptcha();                           // fully remove old widget + holder
      await getRvReady(() => setError("Security check expired, please try again."))
        .catch(() => {});        
    } finally {
      setLoading(false);
    }
  };

  // RESEND
  const handleResendCode = async () => {
    setError(""); setLoading(true);
    try {
      const verifier = await getRvReady(() => setError("Security check expired, please try again."));
      await verifier.verify();
      const confirmation = await signInWithPhoneNumber(auth, phone, verifier);
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
                {/* <div className="col-lg-12">
                  <div id="recaptcha-container" style={{ marginTop: "10px" }} />
                </div> */}

                <div className="col-lg-12">
                  <div className="mt-2 mt-md-3">
                    <button
                      type="submit"
                      className="btn btn-lg btn-secondary w-100"
                      disabled={loading || !phone || phone.length < 8}
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
