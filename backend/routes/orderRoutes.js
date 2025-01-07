const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");



router.get("/", authMiddleware, async (req, res) => {
  try {
    // Log the authentication status for debugging
    console.log("Auth Status (req.user):", req.user);

    // Check if the user is authenticated and has a restaurantId
    if (!req.user || !req.user.restaurantId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Restaurant authentication required.",
      });
    }

    // Fetch orders only for the authenticated restaurant
    const orders = await Order.find({
      restaurant: req.user.restaurantId, // Filter by restaurantId
    })
      .populate("user", "name email phone") // Populate only necessary user fields
      .populate("restaurant", "name address") // Populate only necessary restaurant fields
      .populate("orderItems.menuItem", "name price") // Populate only necessary menu item fields
      .sort({ createdAt: -1 }); // Sort orders by newest first

    // Respond with the fetched orders
    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    // Log any errors and send a server error response
    console.error("Error fetching restaurant orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching restaurant orders",
      error: error.message,
    });
  }
});
router.get("/customer-orders", authMiddleware, async (req, res) => {
  try {
    // Check if user is properly attached to req.user
    console.log("Authenticated User:", req.user);

    if (!req.user ) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login first.",
      });
    }

    // Fetch orders for the authenticated customer
    const orders = await Order.find({
      user: req.user.id, // Fetch orders for this customer
    })
      .populate("user", "name email phone")
      .populate("restaurant", "name address")
      .populate("orderItems.menuItem", "name price")
      .sort({ createdAt: -1 }); // Sort orders by newest first

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching customer orders",
      error: error.message,
    });
  }
});


router.get("/:id", async (req, res) => {
  const { id } = req.params;

  // Check if the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid order ID" });
  }

  try {
    const order = await Order.findById(id)
      .populate("user","name")
      .populate("restaurant")
      .populate("orderItems.menuItem");

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get all orders



router.post("/create-order", async (req, res) => {
  try {
    const order = new Order({
      user: req.body.user,
      restaurant: req.body.restaurant,
      orderItems: req.body.orderItems,
      specialInstructions: req.body.specialInstructions,
      deliveryAddress: req.body.deliveryAddress,
      contactNumber: req.body.contactNumber,
    });

    const newOrder = await order.save();

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// get single order

// create new order

router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not Found!!" });
    }

    order.status = req.body.status;

    if (req.body.paymentStatus) {
      order.paymentStatus = req.body.paymentStatus;
    }

    const updateOrder = await order.save();

    res.json(updateOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found.." });
    }
    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
