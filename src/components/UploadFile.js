import React, { useState } from "react";
import { assets } from "@/utils/assets";
const uploadFiles = assets.icons("upload-files.svg");
const secure = assets.icons("secure.svg");
const cancel = assets.icons("cancel.svg");
// import uploadFiles from "@/assets/icons/upload-files.svg";
// import secure from "@/assets/icons/secure.svg";
// import cancel from "@/assets/icons/cancel.svg";

const UploadFiles = ({ acceptedFiles = "jpg and png only.", callback }) => {
  const [progressWidth, setProgressWidth] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentFile, setCurrentFile] = useState(null);
 // Initial time in seconds

  const cancelUpload = () => {
    setProgressWidth(0);
    setTimeLeft(0);
    setCurrentFile(null);
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    setTimeLeft(5);
    // Simulate the progress by increasing width from 0 to 100
    let width = 0;
    const interval = setInterval(() => {
      width += 20; // You can adjust the increment to control the speed
      setProgressWidth(width);

      // Calculate time remaining (assuming 5 seconds total)
      setTimeLeft((prevTime) => Math.max(prevTime - 1, 0));

      if (width >= 100) {
        clearInterval(interval);
      }
    }, 100); // You can adjust the interval to control the animation speed

    callback(files);
  };

  return (
    <div className="form-wrapper p-3 p-md-4">
      {/* File Upload */}
      <div className="upload-files-wrapper text-center position-relative">
        <div>
          <img src={uploadFiles} className="img-fluid" alt="icon" />
          <h5 className="mt-2">
            <span className="text-primary">Drap your file(s) or</span>{" "}
            <span className="text-danger">browse</span>
          </h5>
        </div>
        <input
          onChange={handleFileChange}
          type="file"
          accept="all files"
          className="position-absolute w-100 h-100 start-0 top-0 opacity-0"
        />
      </div>
      {/* Instructions */}
      <div className="d-flex flex-column flex-sm-row gap-1 align-items-center mt-2 mb-3 justify-content-between">
        <p>
          <span className="text-primary">Accepted File Type :</span>{" "}
          <span className="fw-light">{acceptedFiles}</span>
        </p>
        <p className="text-primary d-flex align-items-center">
          <img src={secure} alt="icon" />
          <span className="fw-medium ms-2">100% Secure. Zero Spam</span>
        </p>
      </div>
      {/* Uploading */}
      <div className="uploading-wrapper">
        <h5 className="text-primary">
          {progressWidth >= 100
            ? "Uploaded"
            : progressWidth === 0
            ? "Upload"
            : "Uploading"}
        </h5>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <p className="text-gray opacity-50">{`${progressWidth}% - ${timeLeft} seconds left`}</p>
          <div className="d-inline-flex gap-2 align-items-center">
            {/* <button type="button" className="link-btn">
              <img src={pause.src} alt="icon" />
            </button> */}
            <button
              onClick={() => cancelUpload()}
              type="button"
              className="link-btn"
            >
              <img src={cancel} alt="icon" />
            </button>
          </div>
        </div>
        <div
          className="progress"
          role="progressbar"
          aria-label="Basic example"
          aria-valuenow={progressWidth}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div
            className="progress-bar"
            style={{ width: `${progressWidth}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default UploadFiles;
