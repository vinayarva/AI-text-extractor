import uploadFileToGCS from "../services/gcsUploadService.js";
import performOcrOnGcsPdf from "../services/gcsOcrService.js";
import getJsonFromGCS from "../services/gcsDataFetcherService.js";
import extractInsightsFromText from "../services/textProcessingService.js";

export const processDocumentUpload = async (req, res) => {
  try {
    //check for file existence
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No file uploaded.Please provide a file" });
    }

    // if (req.file.mimetype !== 'application/pdf') {
    //   return res.status(400).json({ message: 'Invalid file type. Only PDF files are accepted.' });
    // }

    // upload the file to google cloud service
    const gcsFileUrl = await uploadFileToGCS(req.file);

    if (req.file && req.file.buffer) {
      req.file.buffer = null;
    }

    // Perform OCR on the uploaded file in GCS
    const ocrOutputGcsUri = await performOcrOnGcsPdf(gcsFileUrl);

    // Get the JSON content from the OCR output URI in GCS
    const ocrJsonResponse = await getJsonFromGCS(ocrOutputGcsUri);

    const fullText = ocrJsonResponse?.responses?.[0]?.fullTextAnnotation?.text;

    //check if the response is present
    if (!fullText) {
      console.error(
        "Could not extract fullTextAnnotation from OCR response:",
        ocrJsonResponse
      );
      return res
        .status(500)
        .json({
          message:
            "Failed to extract text from OCR result. The structure might be unexpected.",
        });
    }

    const structuredData = await extractInsightsFromText(fullText);

    // Respond with the file URL after successful upload
    return res
      .status(200)
      .json({
        message: "File processed successfully.",
        processedData: structuredData,
      });
  } catch (err) {
    console.error("Error during document processing pipeline:", err);
    res
      .status(500)
      .json({ message: "An error occurred during file processing." });
  }
};


