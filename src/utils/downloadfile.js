// export function downloadFile(url) {
//     const anchor = document.createElement("a");
//     anchor.href = url;
//     anchor.download = url.split("/").pop(); // Extract the file name from the URL
//     anchor.click();
//   }

export function downloadFile(url) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.setAttribute("download", url.split("/").pop()); // Extract file name
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}
