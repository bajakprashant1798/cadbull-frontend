// import { downloadFile } from "@/utils/downloadfile";
// import { downloadHistory, downloadProject } from "./api";
// import { toast } from "react-toastify";


// export const handledownload = async (id,isAuthenticated,router) => {
//   if (!isAuthenticated) {
//     toast.warning("Please login to download the file");
//     console.error("❌ No token found, redirecting to login...");
//     router.push("/auth/login"); // Redirect to login if not authenticated
//     return;
//   }
 
//   try {
//       const res = await downloadProject( id, router);

//       // If response is empty, the request was likely redirected, so stop execution
//       if (res?.status === 403 && res?.data?.redirectUrl) {
//         toast.warning("Gold membership required. Redirecting to pricing page.");
//         router.push(res.data.redirectUrl);
//         return;
//       }
//       console.log("res", res);
      
  
//       if (!res || res?.status !== 200) {
//         toast.error("Error downloading file.");
//         console.log(res?.status, res?.data);
        
//         return;
//       }

//       // await downloadProject(token, id, router);

//       // ✅ Create Download Link Securely
//       const fileBlob = new Blob([res.data]);
//       const downloadUrl = URL.createObjectURL(fileBlob);
//       const link = document.createElement("a");
//       link.href = downloadUrl;
//       link.download = `project_${id}.zip`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(downloadUrl);

//       toast.success("Download started.");

//       console.log("✅ Download successful & history recorded");
//   } catch (err) {
//       console.error("❌ Download error:", err);
//       toast.error("Failed to download file.");
//   }
// };

import { downloadFile } from "@/utils/downloadfile";
import { downloadProject } from "./api";
import { toast } from "react-toastify";
import { redirectToLogin } from "@/utils/redirectHelpers";
import { trackDownload, trackCustomEvent } from "@/lib/fbpixel";

export const handledownload = async (id, isAuthenticated, router, projectName = '', fileType = 'dwg') => {
  if (!isAuthenticated) {
    toast.warning("Please login to download the file");
    return redirectToLogin(router);
  }

  try {
    const res = await downloadProject(id, router);

    // Gold membership required
    if (res?.data?.redirectUrl) {
      toast.warning("Gold membership required. Redirecting...");
      return router.push(res.data.redirectUrl);
    }

    // Download limit reached
    if (
      res?.data?.message &&
      res?.status === 403 &&
      res.data.message.toLowerCase().includes("download limit")
    ) {
      toast.error("Your daily limit of downloads is over. Please try again tomorrow or upgrade your plan.");
      return;
    }

    if (typeof res?.data?.url === "string") {
      downloadFile(res.data.url);
      toast.success("Download started.");
      
      // Track download with Meta Pixel
      trackDownload(projectName || `project_${id}`, fileType);
      
      return;
    } else {
      console.error("Unexpected download response format:", res.data);
      toast.error("Invalid download response.");
    }

    toast.error("Download failed: Invalid server response.");
    console.error("Unexpected download response format:", res.data);
  } catch (err) {
    console.log("❌ Download error:", err);
    
    // Axios error: check if response is available
    if (err?.response?.status === 404) {
      router.push('/404');
      return;
    }
    if (err.response && err.response.status === 403) {
      // Check backend error message
      if (
        err.response.data?.message &&
        err.response.data.message.toLowerCase().includes("download limit")
      ) {
        toast.error("Your daily limit of downloads is over. Please try again tomorrow or upgrade your plan.");
        return;
      }
      if (err.response.data?.redirectUrl) {
        toast.warning("Gold membership required. Redirecting...");
        return router.push(err.response.data.redirectUrl);
      }
    }
    toast.error("Failed to download file.");
    console.error("❌ Download error:", err);
  }
};
