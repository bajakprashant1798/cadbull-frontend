// src/utils/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

// Only initialize ONCE!
const app = !getApps().length
  ? initializeApp({
      apiKey: "AIzaSyB1aPF5DktAc6yojjYODVWA7jVUtf-UqTU",
      authDomain: "cadbull-8e9a8.firebaseapp.com",
      projectId: "cadbull-8e9a8",
      storageBucket: "cadbull-8e9a8.appspot.com",
      messagingSenderId: "279271034408",
      appId: "1:279271034408:web:260181d0132a8459f82f1d"
    })
  : getApps()[0];

const auth = getAuth(app);

export { app, auth, RecaptchaVerifier }; // <--- export app if you want to debug it
