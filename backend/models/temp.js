const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    companyName: String,
    email: String,
    password: String,
    companyType: String
});

module.exports = mongoose.model("User", userSchema);