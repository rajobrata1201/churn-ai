const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  userId: String,

  fileName: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  },

  results: Array,   // predictions from ML
  decisions: Object // user decisions (lenient/aggressive)
});

module.exports = mongoose.model("Upload", uploadSchema);