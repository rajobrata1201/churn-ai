const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const Upload = require("../models/Upload");

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File received:", req.file.originalname);

    // STEP 1 — send file to ML service
    const form = new FormData();
    form.append("file", fs.createReadStream(req.file.path));

    const response = await axios.post(
      "http://127.0.0.1:8000/predict",
      form,
      {
        headers: form.getHeaders(),
      }
    );

    const results = response.data;

    // STEP 2 — SAVE TO DATABASE

    // TODO: replace with real user ID from login later
    const userId = "demo-user";

    const newUpload = new Upload({
      userId,
      fileName: req.file.originalname,
      results,
      decisions: {}
    });

    await newUpload.save();

    console.log("Saved upload:", newUpload._id);

    // STEP 3 — delete temp file
    fs.unlinkSync(req.file.path);

    // STEP 4 — send response
    res.json({
      uploadId: newUpload._id,
      results
    });

  } catch (error) {
    console.error("Upload error:", error.message);

    // cleanup temp file
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: "ML prediction failed",
      details: error.message
    });
  }
});

module.exports = router;