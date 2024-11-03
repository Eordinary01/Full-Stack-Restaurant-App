const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Menu item name is required"],
      minlength: [3, "Menu item name must be atleast 3 characters long"],
    },

    description: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a positive number"],
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      enum: ["Appetizer", "Main Course", "Dessert", "Beverage", "Snack"],
      default: "Main Course",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    ratings: {
      averageRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      reviewCount: {
        type: Number,
        default: 0,
      },
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);