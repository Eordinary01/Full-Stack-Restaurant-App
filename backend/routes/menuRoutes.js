const mongoose = require("mongoose");

const express = require("express");
const MenuItem = require("../models/MenuItem");
const Auth = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const Restaurant = require("../models/Restaurant");
const fs = require("fs");

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(null, "menu-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (jpg, jpeg, png, gif) are allowed"));
    }
  },
}).single("image"); // Ensure this matches your form field name

const handleUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer-specific errors
      return res.status(400).json({
        message: `File upload error: ${err.message}`,
        code: "UPLOAD_ERROR",
      });
    } else if (err) {
      // Other errors
      return res.status(400).json({
        message: err.message || "File upload failed",
        code: "UPLOAD_ERROR",
      });
    }

    next();
  });
};

router.post("/create-menu", Auth, /* handleUpload, */ async (req, res) => {
  try {
    // console.log("Request body:", req.body);
    // console.log("File:", req.file);

    const { name, description, price, restaurantId, category } = req.body;

    // Validate image upload
    /* if (!req.image) {
      return res.status(400).json({
        message: "Image is required",
        details: "Please upload an image file",
      });
    } */

    // Validate image file type
    /* const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      fs.unlinkSync(req.file.path); // Delete invalid file
      return res.status(400).json({
        message: "Invalid file type",
        details: "Please upload JPEG, JPG or PNG files only",
      });
    } */

    // Validate file size (e.g., max 5MB)
    /* const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (req.file.size > maxSize) {
      fs.unlinkSync(req.file.path); // Delete oversized file
      return res.status(400).json({
        message: "File too large",
        details: "Maximum file size is 5MB",
      });
    } */

    // Validate required fields
    if (!name || !description || !price || !restaurantId || !category) {
      /* if (req.file) {
        fs.unlinkSync(req.file.path);
      } */
      return res.status(400).json({
        message: "Missing required fields",
        details: {
          name: !name ? "Name is required" : null,
          description: !description ? "Description is required" : null,
          price: !price ? "Price is required" : null,
          restaurantId: !restaurantId ? "Restaurant ID is required" : null,
          category: !category ? "Category is required" : null,
        },
      });
    }

    // Validate restaurantId
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      /* if (req.file) {
        fs.unlinkSync(req.file.path);
      } */
      return res.status(400).json({ message: "Invalid restaurant ID" });
    }

    // Validate price
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      /* if (req.file) {
        fs.unlinkSync(req.file.path);
      } */
      return res
        .status(400)
        .json({ message: "Price must be a positive number" });
    }

    // Validate category
    const ALLOWED_CATEGORIES = [
      "Appetizer",
      "Main Course",
      "Dessert",
      "Beverage",
      "Snack",
    ];
    if (!ALLOWED_CATEGORIES.includes(category)) {
      /* if (req.file) {
        fs.unlinkSync(req.file.path);
      } */
      return res.status(400).json({
        message: `Invalid category. Must be one of: ${ALLOWED_CATEGORIES.join(
          ", "
        )}`,
      });
    }

    // Check if restaurant exists and user has permission
    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      owner: req.user.userId,
    });

    if (!restaurant) {
      /* if (req.file) {
        fs.unlinkSync(req.file.path);
      } */
      return res.status(403).json({
        message: "Not authorized to add menu items to this restaurant",
      });
    }

    // Create menu item with image path
    const menuItem = new MenuItem({
      name: name.trim(),
      description: description.trim(),
      category,
      price: numericPrice.toFixed(2),
      /* image: req.file.path, */
      restaurant: restaurantId,
    });

    await menuItem.save();

    res.status(201).json({
      success: true,
      data: {
        ...menuItem.toObject(),
        /* imageUrl: `/uploads/${req.file.filename}`, */ // Assuming your static files are served from /uploads
      },
      message: "Menu item created successfully",
    });
  } catch (error) {
    // Clean up uploaded file if there's an error
    /* if (req.file) {
      fs.unlinkSync(req.file.path);
    } */

    console.error("Error Creating Menu Item:", error);
    res.status(500).json({
      message: "Error creating menu item",
      error: error.message,
    });
  }
});

router.get("/owner-menu/:restaurantId", Auth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      _id: req.params.restaurantId,
      owner: req.user.userId,
    });

    if (!restaurant) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this restaurant's menu" });
    }

    const menuItems = await MenuItem.find({
      restaurant: req.params.restaurantId,
    }).sort({ createdAt: -1 });

    const groupedMenuItems = menuItems.reduce((acc, item) => {
      const category = item.category || "Uncategorized";
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
        name: restaurant.name,
      },
      menuItems: groupedMenuItems,
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
