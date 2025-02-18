import { downloadFile } from "@/utils/downloadfile";
import { downloadHistory, downloadProject } from "./api";
import { toast } from "react-toastify";


export const handledownload = async (id,token,router) => {
  if (!token) {
    toast.warning("Please login to download the file");
    console.error("❌ No token found, redirecting to login...");
    router.push("/auth/login"); // Redirect to login if not authenticated
    return;
  }
 
  try {
      const res = await downloadProject(token, id, router);

      // If response is empty, the request was likely redirected, so stop execution
      if (res?.status === 403 && res?.data?.redirectUrl) {
        toast.warning("Gold membership required. Redirecting to pricing page.");
        router.push(res.data.redirectUrl);
        return;
      }
      console.log("res", res);
      
  
      if (!res || res?.status !== 200) {
        toast.error("Error downloading file.");
        console.log(res?.status, res?.data);
        
        return;
      }

      // await downloadProject(token, id, router);

      // ✅ Create Download Link Securely
      const fileBlob = new Blob([res.data]);
      const downloadUrl = URL.createObjectURL(fileBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `project_${id}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      toast.success("Download started.");

      console.log("✅ Download successful & history recorded");
  } catch (err) {
      console.error("❌ Download error:", err);
      toast.error("Failed to download file.");
  }
};