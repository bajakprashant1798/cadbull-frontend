// src/utils/firebase.js
import { initializeApp, getApps, SDK_VERSION } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

// Only initialize ONCE!
// const app = !getApps().length
//   ? initializeApp({
//       apiKey: "AIzaSyB1aPF5DktAc6yojjYODVWA7jVUtf-UqTU",
//       authDomain: "cadbull-8e9a8.firebaseapp.com",
//       projectId: "cadbull-8e9a8",
//       storageBucket: "cadbull-8e9a8.appspot.com",
//       messagingSenderId: "279271034408",
//       appId: "1:279271034408:web:260181d0132a8459f82f1d"
//     })
//   : getApps()[0];

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// Initialize once (avoids duplicate apps in Next.js)
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
// const auth = getAuth(app);

// export { app, auth, RecaptchaVerifier }; // <--- export app if you want to debug it
