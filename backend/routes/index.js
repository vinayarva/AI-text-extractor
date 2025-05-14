import express from "express";
import upload from "../middleware/multer.js";
import { processDocumentUpload } from "../controllers/handleDocumentUploadAndProcess.js";

const route = express.Router();

route.post("/upload", upload.single("file"), processDocumentUpload);

export default route;
