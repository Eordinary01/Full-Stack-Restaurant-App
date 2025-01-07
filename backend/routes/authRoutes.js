const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");

const router = express.Router();

require("dotenv").config();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, restaurantName, restaurantAddress, restaurantDescription, restaurantPhone } = req.body;

    const isAdminEmail = email.toUpperCase() === process.env.ADMIN_EMAIL.toUpperCase();

    const assignedRole = isAdminEmail
      ? "admin"
      : role === "customer" || role === "owner"
      ? role
      : null;

    if (!assignedRole) {
      return res.status(400).json({ message: "Invalid Role!" });
    }

    // Check if restaurant details are provided for restaurant owners
    if (role === "owner" && (!restaurantName || !restaurantAddress || !restaurantDescription || !restaurantPhone)) {
      return res.status(400).json({ message: "Restaurant details (name, address, description, phone number) are required for restaurant owners" });
    }

    const existingUser = await User.findOne({ email: email.toUpperCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name: name.toUpperCase(),
      email: email.toUpperCase(),
      password: hashedPassword,
      role: assignedRole,
    });

    // If user is a restaurant owner, create restaurant and associate it
    if (role === "owner") {
      const restaurant = new Restaurant({
        name: restaurantName.toUpperCase(),
        address: restaurantAddress.toUpperCase(),
        description: restaurantDescription.toUpperCase(),
        phone: restaurantPhone,
        owner: user._id
      });

      await restaurant.save();
      user.restaurantId = restaurant._id;
    }

    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});



router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toUpperCase() })
      .populate('restaurantId', 'name address'); 

    if (!user) {
      return res.status(400).json({ 
        message: "Please register or verify your email" 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        restaurantId: user.restaurantId?._id 
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        restaurant: user.restaurantId ? {
          id: user.restaurantId._id,
          name: user.restaurantId.name,
          address: user.restaurantId.address
        } : null
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});


router.get("/verify", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-password")
      .populate('restaurantId', 'name address');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      restaurant: user.restaurantId ? {
        id: user.restaurantId._id,
        name: user.restaurantId.name,
        address: user.restaurantId.address
      } : null
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Error while verifying token" });
  }
});

module.exports = router;
