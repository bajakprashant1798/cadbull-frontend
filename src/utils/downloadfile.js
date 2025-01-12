export function downloadFile(url) {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = url.split("/").pop(); // Extract the file name from the URL
    anchor.click();
  }