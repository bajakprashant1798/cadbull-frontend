// Removes any classic v2 reCAPTCHA script and global so Firebase Enterprise can work
export function removeClassicRecaptcha() {
  // 1) Remove <script src="https://www.google.com/recaptcha/api.js"...>
  document
    .querySelectorAll('script[src^="https://www.google.com/recaptcha/api.js"]')
    .forEach(s => s.parentElement && s.parentElement.removeChild(s));

  // 2) If window.grecaptcha is the classic one (no .enterprise), delete it
  const w = typeof window !== "undefined" ? window : {};
  if (w.grecaptcha && !w.grecaptcha.enterprise) {
    try { delete w.grecaptcha; } catch { w.grecaptcha = undefined; }
  }
}
