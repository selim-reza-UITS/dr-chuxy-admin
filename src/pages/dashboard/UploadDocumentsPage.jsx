import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { useUploadPdfMutation } from "../../features/pdfUpload/pdfUploadApi";
import toast from "react-hot-toast";

const UploadDocuments = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pmid, setPmid] = useState("");
  const fileInputRef = useRef(null);
  const [uploadPdf, { isLoading }] = useUploadPdfMutation();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    setFile(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file && !pmid) {
      toast.error("Please upload a file or enter a PMID");
      return;
    }

    if (!file) {
      toast.error("Please upload a PDF file along with the PMID");
      return;
    }

    const formData = new FormData();
    // Changed from "file" to "pdf_file" to match your backend expectation
    formData.append("pdf_file", file);
    if (pmid) formData.append("pmid", pmid);

    console.log("File:", formData.get("pdf_file")); // Updated field name
    console.log("PMID:", pmid);

    try {
      const response = await uploadPdf(formData).unwrap();
      toast.success("Document uploaded successfully!");
      console.log("Upload response:", response);
      setFile(null);
      setPmid("");
    } catch (error) {
      console.error("Error uploading PDF:", error);
      toast.error(
        error.data?.message || "Failed to upload document. Please try again."
      );
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Upload Your File</h1>

      <div className="max-w-xl mx-auto">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex justify-center mb-4">
            <Upload className="h-16 w-16 text-gray-400" />
          </div>

          <p className="text-lg font-medium mb-2">drag and drop your file</p>
          <p className="text-gray-500 mb-4">Or</p>

          <button
            type="button"
            onClick={handleBrowseClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Browse file
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            accept=".pdf"
            className="hidden"
          />

          {file && (
            <div className="mt-4 p-2 bg-gray-100 rounded-md text-left">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PMID
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={pmid}
            onChange={(e) => setPmid(e.target.value)}
          />
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadDocuments;
