import { useState } from "react";
import ImageUpload from "./ImageUpload";
import SimplifiedReport from "./SimplifiedReport";
import Loading from "./Loading";

const MAX_SIZE = 10 * 1024 * 1024; // keep in sync with the backend limit

const Home = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const UploadImageHandler = async (file) => {
    setReport(null);
    setError(null);

    if (file.size > MAX_SIZE) {
      setError("File is too large. Please upload a file under 10 MB.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file); // field name must match upload.single("file") in the backend

    try {
      // Dev: relative path -> Vite proxy (vite.config.js). Prod: full backend URL from VITE_BACKEND_URL.
      const apiPath = import.meta.env.DEV
        ? "/ai/simplify-report"
        : `${import.meta.env.VITE_BACKEND_URL}/ai/simplify-report`;

      const response = await fetch(apiPath, { method: "POST", body: formData });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.status === "unprocessed") {
        setError(
          data.reason ||
            data.error ||
            "Couldn't process this report. Try a clearer image or another file."
        );
        return;
      }

      setReport(data);
    } catch (err) {
      console.error("UploadImageHandler error:", err);
      setError("Failed to reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <ImageUpload UploadImageHandler={UploadImageHandler} disabled={loading} />

      {loading && <Loading />}

      {error && (
        <p className="mt-4 z-10 text-red-400 bg-gray-900/80 px-4 py-2 rounded-lg max-w-md text-center">
          {error}
        </p>
      )}

      {report && <SimplifiedReport report={report} />}
    </div>
  );
};

export default Home;