/**
 * Checks if a user has an active paid subscription based on `acc_exp_date`.
 *
 * @param {Object} [user] - User object from Redux state (optional, falls back to localStorage).
 * @returns {boolean} True if the user has an active subscription; false otherwise.
 */
export const isUserSubscribed = (user) => {
  let targetUser = user;

  // Fallback to localStorage if Redux state is not yet hydrated
  if ((!targetUser || !targetUser.acc_exp_date) && typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("userData");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.acc_exp_date) {
          targetUser = parsed;
        }
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
  }

  if (!targetUser || !targetUser.acc_exp_date) {
    return false;
  }

  try {
    const raw = targetUser.acc_exp_date;
    let expTime;

    if (typeof raw === "string") {
      // Handle "YYYY-MM-DD" and "YYYY-MM-DDTHH:mm:ss..." / "YYYY-MM-DD HH:mm:ss"
      const datePart = raw.split("T")[0].split(" ")[0];
      const parts = datePart.split("-").map(Number);
      if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
        // Generously cover through 23:59:59.999 in both local timezone and UTC so users never lose access early
        const localExp = new Date(parts[0], parts[1] - 1, parts[2], 23, 59, 59, 999).getTime();
        const utcExp = Date.UTC(parts[0], parts[1] - 1, parts[2], 23, 59, 59, 999);
        expTime = Math.max(localExp, utcExp);
      } else {
        const expDate = new Date(raw);
        expDate.setHours(23, 59, 59, 999);
        expTime = expDate.getTime();
      }
    } else {
      const expDate = new Date(raw);
      expDate.setHours(23, 59, 59, 999);
      expTime = expDate.getTime();
    }

    if (isNaN(expTime)) {
      return false;
    }

    return expTime >= Date.now();
  } catch (e) {
    return false;
  }
};
