// // src/utils/firebase.js
// import { initializeApp, getApps } from "firebase/app";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//     apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//     authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
// };

// // Initialize Firebase
// // const app = initializeApp(firebaseConfig);
// // Initialize once (avoids duplicate apps in Next.js)
// const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// // Initialize Firebase Authentication and get a reference to the service
// export const auth = getAuth(app);
// export default app;
// // const auth = getAuth(app);

// // export { app, auth, RecaptchaVerifier }; // <--- export app if you want to debug it


import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const app = getApps().length ? getApps()[0] : initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
});

export const auth = getAuth(app);
export default app;
