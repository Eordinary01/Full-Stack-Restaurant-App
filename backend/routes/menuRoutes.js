const express = require("express");
const MenuItem = require("../models/MenuItem");
const Auth = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const Restaurant = require("../models/Restaurant");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);
    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error("Images only!"));
    }
  },
});

router.post("/create-menu", Auth, upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, restaurantId } = req.body;
    console.log("req.file", req.file); // Check if the file is received

    // Ensure the image file was uploaded
    // if (!req.file) {
    //   return res.status(400).json({ message: "Image is required" });
    // }

    // Path of the uploaded image
    const imagePath = req.file ? req.file.path : null;

    // Ensure required fields are provided
    if (!name || !description || !price || !restaurantId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create the menu item object
    const menuItem = new MenuItem({
      name,
      description,
      price,
      image: imagePath,
      restaurant: restaurantId,
    });

    
    await menuItem.save();

    
    res.status(201).json({ success: true, data: menuItem });
  } catch (error) {
    console.error("Error Creating Menu Item:", error);
    res.status(500).json({ message: "Error creating menu item" });
  }
});


router.get("/owner-menu/:restaurantId", Auth, async (req, res) => {
  try {
    
    const restaurant = await Restaurant.findOne({
      _id: req.params.restaurantId,
      owner: req.user.userId
    });

    if (!restaurant) {
      return res.status(403).json({ message: "Not authorized to view this restaurant's menu" });
    }

    
    const menuItems = await MenuItem.find({
      restaurant: req.params.restaurantId
    }).sort({ createdAt: -1 });

    
    const groupedMenuItems = menuItems.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});

    res.json({
      success: true,
      restaurant: {
        id: restaurant._id,
        name: restaurant.name
      },
      menuItems: groupedMenuItems
    });
  } catch (error) {
    console.error("Error fetching owner's menu:", error);
    res.status(500).json({ message: "Error fetching menu items" });
  }
});


router.get("/restaurant/:restaurantId", async (req, res) => {
  try {
    const menuItems = await MenuItem.find({
      restaurant: req.params.restaurantId,
    });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: "Error Fetching Menu Items.." });
  }
});

module.exports = router;
