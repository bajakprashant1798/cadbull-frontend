// pages/loggedout.js
import { useEffect } from "react";

export default function LoggedOut() {
  useEffect(() => {
    localStorage.clear();
    // Optionally reset Redux/other client state
    // Optionally redirect to home/AMP home
    // window.location.href = "/amphome";
  }, []);
  return <div>You are logged out.</div>;
}
