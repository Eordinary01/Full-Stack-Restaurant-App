const express = requrie("express");
const Restaurant = require("../models/Restaurant");
const Auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", Auth, async (req, res) => {
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
    res.status(500).json({ message: "Error Creating restaurants" });
  }
});

router.get("/", async (req, res) => {
  try {
    const restaurant = await Restaurant.find();
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurants" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if(!restaurant){
        return res.status(404).json({message:'Restaurant not found..'})
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurants" });
  }
});


module.exports = router;
