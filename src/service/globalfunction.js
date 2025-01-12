import { downloadFile } from "@/utils/downloadfile";
import { downloadHistory, downloadProject } from "./api";


export const handledownload = (id,token,router) => {
    if(!token){
      router.push("/auth/login");
      return
    }
    else{
    downloadProject(token, id)
      .then((res) => {
        const zipUrl = res.data.zip_url;
        downloadFile(zipUrl);
        downloadHistory(token, id)
          .then((res) => {
            console.log("download", res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
    }
  };