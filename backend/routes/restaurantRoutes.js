const express = require("express");
const Restaurant = require("../models/Restaurant");
const Auth = require("../middleware/authMiddleware");

const router = express.Router();





router.post("/create-restaurant", Auth, async (req, res) => {
  try {
    const { name, description, address, phone } = req.body;

    const restaurant = new Restaurant({
      name,
      description,
      address,
      phone,
      owner: req.user.userId,
    });
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Error Creating restaurant" });
  }
});

router.get("/owner", Auth, async (req, res) => {
  try {
    console.log(req.user);
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found",
      });
    }

    console.log("Fetching restaurants for user:", userId);

    const ownerRestaurants = await Restaurant.find({ owner: userId })
      .select("name address phone description")
      .lean();

    console.log("Owner restaurants found:", ownerRestaurants.length);
    console.log("First restaurant:", ownerRestaurants[0]);

    return res.status(200).json({
      success: true,
      restaurants: ownerRestaurants,
      count: ownerRestaurants.length,
    });
  } catch (error) {
    console.log("Error fetching owner restaurants:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching restaurants",
    });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurant" });
  }
});


router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurants" });
  }
});



module.exports = router;
