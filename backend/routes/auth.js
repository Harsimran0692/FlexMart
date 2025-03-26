const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const TokenDecoder = require("../helper/tokenDecoder");

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({ name, email, password });
    await user.save();

    const payload = { user: { id: user._id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ msg: "Invalid credentials Email not Registered" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const payload = { user: { id: user._id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, name: user.name });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    if (users.length == 0) {
      return res.status(404).json({ msg: "No User Found" });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ msg: "Server Error: " + error.message });
  }
});

router.get("/user", async (req, res) => {
  try {
    // Check if Authorization header exists and is properly formatted
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ msg: "No token provided or invalid format" });
    }

    // Extract token
    const userToken = authHeader.split(" ")[1];
    if (!userToken) {
      return res.status(401).json({ msg: "Token missing" });
    }

    const userId = TokenDecoder(userToken);

    // Find user by ID
    const user = await User.findById(userId).select("name email");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Return user data
    res.status(200).json({
      name: user.name,
      email: user.email, // Optional
    });
  } catch (error) {
    res.status(500).json({ msg: "Server Error: " + error.message });
  }
});

module.exports = router;
