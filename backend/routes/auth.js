const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
    const { companyName, email, password, companyType } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
        companyName,
        email,
        password: hashed,
        companyType
    });

    await user.save();

    res.json({ message: "User created" });
});

// LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Wrong password" });

    const token = jwt.sign({ id: user._id }, "secretkey");

    res.json({ token });
});

module.exports = router;