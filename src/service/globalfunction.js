import { downloadFile } from "@/utils/downloadfile";
import { downloadHistory, downloadProject } from "./api";


export const handledownload = async (id,token,router) => {
  if (!token) {
      console.error("❌ No token found, redirecting to login...");
      router.push("/auth/login"); // Redirect to login if not authenticated
      return;
  }
 
  try {
      const res = await downloadProject(token, id, router);

      // If response is empty, the request was likely redirected, so stop execution
      if (!res || res.status === 403) {
         
        if (res?.data?.redirectUrl) {
          console.log("🔄 Redirecting to:", res.data.redirectUrl);
          router.push(res.data.redirectUrl); // Redirect to pricing page
        } else {
            console.error("❌ No redirect URL provided by backend");
        }
        return;
      }

      // Create a download link for the file
      const fileURL = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", "project.zip"); // File name for user
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Record download history
      // await downloadHistory(token, id);

      console.log("✅ Download successful & history recorded");
  } catch (err) {
      console.error("❌ Download error:", err);
  }
};