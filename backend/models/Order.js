const mongoose = require("mongoose");



const ADD_ONS = {
    PIZZA: [
      "Extra Cheese",
      "Pepperoni", 
      "Mushrooms", 
      "Olives", 
      "Bell Peppers", 
      "Onions", 
      "Bacon", 
      "Chicken", 
      "Sausage",
      "Jalapenos"
    ],
    BURGER: [
      "Extra Patty", 
      "Cheese Slice", 
      "Bacon", 
      "Avocado", 
      "Fried Egg", 
      "Caramelized Onions", 
      "Extra Sauce",
      "Pickles",
      "Grilled Mushrooms"
    ],
  
    DRINK: [
      "Extra Shot of Espresso", 
      "Soy Milk", 
      "Almond Milk", 
      "Oat Milk", 
      "Vanilla Syrup", 
      "Caramel Syrup", 
      "Whipped Cream"
    ],
    GENERAL: [
      "Side Sauce",
      "Extra Dip",
      "Gluten-Free Option",
      "Vegan Option",
      "Spicy Level Upgrade"
    ]
  };

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: [true, "User is required for the order"]
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: [true, "Restaurant is required for the order"]
    },
    orderItems: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
          required: [true, "Menu item is required"]
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"]
        },
        addOns: [
            {
              name: {
                type: String,
                trim: true,
                enum: [
                  ...ADD_ONS.PIZZA, 
                  ...ADD_ONS.BURGER,                
                  ...ADD_ONS.DRINK, 
                  ...ADD_ONS.GENERAL
                ]
              },
              price: {
                type: Number,
                min: [0, "Add-on price must be a positive number"]
              }
            }
          ]
        }
      ],
    totalAmount: {
      type: Number,
      // required: [true, "Total amount is required"],
      min: [0, "Total amount must be a positive number"]
    },
    status: {
      type: String,
      enum: [
        "Pending", 
        "Confirmed", 
        "Preparing", 
        "Ready", 
        "Out for Delivery", 
        "Delivered", 
        "Cancelled"
      ],
      default: "Pending"
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Credit Card", "Debit Card", "Online Payment"],
      // required: [true, "Payment method is required"]
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending"
    },
    specialInstructions: {
      type: String,
      maxlength: [500, "Special instructions cannot exceed 500 characters"]
    },
    deliveryAddress: {
      type: String,
      required: function() {
        return this.status === "Out for Delivery" || this.status === "Delivered";
      }
    },
    contactNumber: {
      type: String,
      validate: {
        validator: function(v) {
          return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    }
  },
  { 
    timestamps: true 
  }
);

// calculate total number of items
orderSchema.virtual('totalItems').get(function() {
  return this.orderItems.reduce((total, item) => total + item.quantity, 0);
});

// calculate total amount before save
orderSchema.pre('save', function(next) {
  this.totalAmount = this.orderItems.reduce((total, item) => {
    // Get the price from the referenced menu item
    const itemPrice = item.menuItem.price;
    
    // Cal add-ons price
    const addOnsPrice = item.addOns 
      ? item.addOns.reduce((addOnTotal, addon) => addOnTotal + (addon.price || 0), 0)
      : 0;
    
    // Cal total for the  item (base item price + add-ons) multiplied by quantity
    return total + ((itemPrice + addOnsPrice) * item.quantity);
  }, 0);
  next();
});

orderSchema.statics.ADD_ONS = ADD_ONS;

module.exports = mongoose.model('Order', orderSchema);