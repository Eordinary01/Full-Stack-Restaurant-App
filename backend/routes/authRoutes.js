const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

require("dotenv").config();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const isAdminEmail =
      email.toUpperCase() === process.env.ADMIN_EMAIL.toUpperCase();

    const assignedRole = isAdminEmail
      ? "admin"
      : role === "customer" || role === "owner"
      ? role
      : null;

    if (!assignedRole) {
      return res.status(400).json({ message: "Invalid Role!" });
    }

    const existingUser = await User.findOne({ email: email.toUpperCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name: name.toUpperCase(),
      email: email.toUpperCase(),
      password: hashedPassword,
      role: assignedRole,
    });

    await user.save();

    
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toUpperCase() });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Please register or verify your email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role,name:user.name },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});

router.get("/verify", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user info
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error while verifying token" });
  }
});

module.exports = router;
