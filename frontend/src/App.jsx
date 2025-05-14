import React, { useState, useCallback } from "react";
import FileUploadPanel from "./components/FileUploadPanel/FileUploadPanel";
import JsonViewerPanel from "./components/JsonViewerPanel/JsonViewerPanel";
import { VIEW_MODES } from "./constants";

function App() {
  const [jsonData, setJsonData] = useState(null);
  const [viewMode, setViewMode] = useState(VIEW_MODES.JSON);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = useCallback(async (e) => {
    const file = e.target.files[0];

    setJsonData(null);
    setError(null);
    setFileName("");

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Invalid file type. Please upload a PDF document.");
      if (e.target) e.target.value = null;
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `Error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          console.warn("Could not parse error response as JSON:", parseError);
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();

      if (responseData && responseData.processedData) {
        setJsonData(responseData.processedData);
        setFileName(file.name);
      } else {
        console.error("API response missing 'finalData' field:", responseData);
        throw new Error(
          "Received an unexpected data structure from the server."
        );
      }
    } catch (err) {
      console.error("API call failed:", err);
      setError(
        err.message ||
          "Failed to upload and process the PDF. Please check the console and ensure the backend server is running."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 font-sans antialiased">
      <FileUploadPanel
        onFileSelect={handleFileUpload}
        isLoading={isLoading}
        error={error}
        fileName={fileName}
      />
      <JsonViewerPanel
        jsonData={jsonData}
        viewMode={viewMode}
        onSetViewMode={setViewMode}
      />
    </div>
  );
}

export default App;
