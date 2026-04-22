const express = require("express");
const router = express.Router();
const Upload = require("../models/Upload");

router.post("/", async (req, res) => {
  const { uploadId, userId, decisionType } = req.body;

  const upload = await Upload.findById(uploadId);

  upload.decisions[userId] = decisionType;

  await upload.save();

  res.json({ message: "Decision saved" });
});

module.exports = router;