const express = require("express");
const router = express.Router();
const Upload = require("../models/Upload");

// GET all uploads
router.get("/", async (req, res) => {
  try {
    const uploads = await Upload.find().sort({ uploadedAt: -1 });
    res.json(uploads);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// GET one upload
router.get("/:id", async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    res.json(upload);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch upload" });
  }
});

module.exports = router;