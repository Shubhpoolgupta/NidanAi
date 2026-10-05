import React, { useState } from "react";
import ImageUpload from "./ImageUpload";
import SimplifiedReport from "./SimplifiedReport";

const Home = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const UploadImageHandler = async (file) => {
    setReport(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const apiPath = import.meta.env.DEV
        ? "/ai/simplify-report"
        : `${import.meta.env.VITE_BACKEND_URL}/ai/simplify-report`;

    

      const response = await fetch(apiPath, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setReport(data);
    } catch (err) {
      console.error("UploadImageHandler error:", err);
      alert("Failed to simplify the report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <ImageUpload UploadImageHandler={UploadImageHandler} />

      {loading && <p className="mt-4 text-indigo-400">Processing your report...</p>}

      {report && <SimplifiedReport report={report} />}
    </div>
  );
};

export default Home;
