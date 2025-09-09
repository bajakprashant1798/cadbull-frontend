// reCAPTCHA Test Utility
// Use this in browser console to test reCAPTCHA configuration

const testRecaptchaConfig = () => {
  console.log('🔍 Testing reCAPTCHA Configuration...');
  
  // Check environment
  console.log('📍 Environment:', process.env.NODE_ENV);
  console.log('🌐 Domain:', window.location.hostname);
  console.log('🔗 Full URL:', window.location.href);
  
  // Check Firebase config
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  };
  console.log('🔥 Firebase Config:', firebaseConfig);
  
  // Check if reCAPTCHA scripts are loaded
  const recaptchaScripts = document.querySelectorAll('script[src*="recaptcha"]');
  console.log('📜 reCAPTCHA Scripts Found:', recaptchaScripts.length);
  recaptchaScripts.forEach((script, index) => {
    console.log(`  ${index + 1}. ${script.src}`);
  });
  
  // Check if grecaptcha is available
  if (typeof window.grecaptcha !== 'undefined') {
    console.log('✅ grecaptcha object available');
    if (window.grecaptcha.enterprise) {
      console.log('🏢 Enterprise reCAPTCHA detected');
    } else {
      console.log('🏠 Classic reCAPTCHA detected');
    }
  } else {
    console.log('❌ grecaptcha object not available');
  }
  
  // Check reCAPTCHA container
  const container = document.getElementById('recaptcha-container');
  if (container) {
    console.log('📦 reCAPTCHA container found');
    console.log('   innerHTML length:', container.innerHTML.length);
    console.log('   Children count:', container.children.length);
  } else {
    console.log('❌ reCAPTCHA container not found');
  }
  
  // Network connectivity test
  console.log('🌐 Testing network connectivity...');
  fetch('https://www.google.com/recaptcha/api.js')
    .then(response => {
      console.log('✅ reCAPTCHA API accessible:', response.status);
    })
    .catch(error => {
      console.log('❌ reCAPTCHA API not accessible:', error);
    });
  
  console.log('✨ Test completed. Check the logs above for issues.');
};

// Auto-run in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  setTimeout(testRecaptchaConfig, 2000);
}

export default testRecaptchaConfig;
