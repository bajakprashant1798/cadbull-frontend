// Phone validation and security utilities

export const validatePhoneNumber = (phone) => {
  if (!phone) return { isValid: false, message: "Phone number is required" };
  
  const normalized = phone.replace(/\D/g, '');
  
  // Basic length check
  if (normalized.length < 10 || normalized.length > 15) {
    return { isValid: false, message: "Phone number must be between 10-15 digits" };
  }
  
  // Check for obvious garbage patterns
  const garbagePatterns = [
    { pattern: /^(.)\1{9,}$/, message: "Invalid phone number format" }, // Same digit repeated
    { pattern: /^(012|123|234|345|456|567|678|789|890|901){3,}/, message: "Invalid phone number format" }, // Sequential
    { pattern: /^(000|111|222|333|444|555|666|777|888|999)/, message: "Invalid phone number format" }, // Obvious fake
  ];
  
  for (const { pattern, message } of garbagePatterns) {
    if (pattern.test(normalized)) {
      return { isValid: false, message };
    }
  }
  
  return { isValid: true };
};

export const normalizePhoneNumber = (phone) => {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
};

// Rate limiting helpers for frontend
export const handleRateLimitError = (error) => {
  if (error?.response?.status === 429) {
    const retryAfter = error.response.data.retryAfter || 600;
    const minutes = Math.ceil(retryAfter / 60);
    return {
      isRateLimit: true,
      message: `${error.response.data.message || 'Too many requests'} Try again in ${minutes} minute(s).`,
      retryAfter
    };
  }
  return { isRateLimit: false };
};

// Country-specific validation (focusing on India since that's your default)
export const validateCountryPhone = (phone, country = 'in') => {
  const normalized = normalizePhoneNumber(phone);
  
  switch (country.toLowerCase()) {
    case 'in':
      // Indian numbers: +91 followed by 10 digits
      if (phone.startsWith('+91') && normalized.length === 12) {
        const number = normalized.slice(2); // Remove country code
        if (!/^[6-9]\d{9}$/.test(number)) {
          return { isValid: false, message: "Invalid Indian mobile number format" };
        }
      }
      break;
    case 'us':
      // US numbers: +1 followed by 10 digits
      if (phone.startsWith('+1') && normalized.length === 11) {
        const number = normalized.slice(1);
        if (!/^[2-9]\d{2}[2-9]\d{2}\d{4}$/.test(number)) {
          return { isValid: false, message: "Invalid US phone number format" };
        }
      }
      break;
    // Add more countries as needed
  }
  
  return { isValid: true };
};
