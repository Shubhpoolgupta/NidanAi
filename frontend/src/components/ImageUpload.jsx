const ImageUpload = ({ UploadImageHandler, disabled }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      UploadImageHandler(file);
    }
    // Reset so choosing the SAME file again still triggers onChange
    e.target.value = "";
  };

  return (
    <div className="relative z-10 flex items-center justify-center w-full max-w-sm">
      <label
        htmlFor="fileInput"
        className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-indigo-400 rounded-xl bg-gray-800/70 transition-all shadow-md ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:bg-gray-700/70 hover:border-pink-400"
        }`}
      >
        <div className="flex flex-col items-center justify-center pt-3 pb-3">
          <svg
            className="w-7 h-7 mb-2 text-indigo-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16V4m10 12V4m-5 8l-5 4h10l-5-4z"
            />
          </svg>
          <p className="text-sm font-semibold text-indigo-200">Upload your report</p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, or PDF (max 10 MB)</p>
        </div>
        <input
          id="fileInput"
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
        />
      </label>
    </div>
  );
};

export default ImageUpload;