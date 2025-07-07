import { useEffect } from "react";
import { auth, RecaptchaVerifier } from "@/utils/firebase";

export default function TestFirebase() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      document.getElementById("recaptcha-container")
    ) {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {}
        window.recaptchaVerifier = null;
      }
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(
          "recaptcha-container",
          { size: "normal" },
          auth
        );
        window.recaptchaVerifier.render();
        console.log("RecaptchaVerifier instance:", window.recaptchaVerifier);
      } catch (err) {
        console.error("Failed to initialize RecaptchaVerifier:", err);
      }
    }
  }, []);

  return (
    <div>
      <div id="recaptcha-container" style={{ margin: 40 }} />
      <p>Check console for auth and recaptcha init</p>
    </div>
  );
}
