"use client";

import { useState, useEffect } from "react";
import { post } from "@/utils/api";
import {
  AlertCircle,
  CheckCircle2,
  X,
  ShoppingBag,
  ChevronRight,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Wallet,
  DollarSign,
  MapPin,
  Phone,
  MessageSquare,
  ArrowRight,
  Search,
  Sparkles,
  Star,
  Clock,
  Users,
  Award,
  Filter,
  ShoppingCart,
  Package,
  Utensils,
  Heart,
} from "lucide-react";

const OrderModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          className="relative w-full max-w-7xl bg-white rounded-3xl shadow-2xl transform transition-all duration-500 ease-out overflow-hidden"
          style={{
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "scale(1)" : "scale(0.95)",
          }}
        >
          {/* Enhanced Header */}
          <div className="relative bg-gradient-to-r from-red-500 via-orange-500 to-pink-600 p-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 blur-2xl" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <ShoppingCart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Place Your Order
                  </h1>
                  <p className="text-white/90">
                    Choose your favorites and we'll prepare them fresh
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-3 rounded-2xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm group"
              >
                <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

const OrderForm = ({ menuItems, restaurantId, onClose }) => {
  const [orderItems, setOrderItems] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [formData, setFormData] = useState({
    paymentMethod: "Credit Card",
    specialInstructions: "",
    deliveryAddress: "",
    contactNumber: "",
  });

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = 2.99;
  const tax = totalAmount * 0.08;
  const finalTotal = totalAmount + deliveryFee + tax;

  const categories = [
    "all",
    ...new Set(menuItems.map((item) => item.category)),
  ];

  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "all" || item.category === selectedCategory)
  );

  const handleAddItem = (menuItem) => {
    setOrderItems((prev) => {
      const existingItem = prev.find((item) => item.menuItem === menuItem._id);
      if (existingItem) {
        return prev.map((item) =>
          item.menuItem === menuItem._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          menuItem: menuItem._id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
          image: menuItem.image,
        },
      ];
    });
  };

  const handleQuantityChange = (index, change) => {
    setOrderItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const handleRemoveItem = (index) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (orderItems.length === 0) {
      setError("Please add items to your order");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await post("/orders/create-order", {
        restaurant: restaurantId,
        orderItems,
        ...formData,
        totalAmount: finalTotal,
      });
      setSuccess("Order placed successfully! We'll prepare it fresh for you.");
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[85vh]">
      {/* Enhanced Menu Items Section */}
      <div className="w-2/5 bg-gradient-to-br from-gray-50 to-white border-r border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
                <p className="text-gray-600 text-sm">Choose your favorites</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-xl">
              <Package className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                {filteredItems.length} items
              </span>
            </div>
          </div>

          {/* Enhanced Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search delicious items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
            />
          </div>

          {/* Category Filter */}
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 h-[calc(100%-200px)] overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            {filteredItems.map((item, index) => (
              <div
                key={item._id}
                className="group p-4 bg-white border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer opacity-0 animate-fade-in-up"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: "forwards",
                }}
                onClick={() => handleAddItem(item)}
              >
                <div className="flex items-center space-x-4">
                  {item.image && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                        {item.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">
                          ${item.price.toFixed(2)}
                        </span>
                        <div className="p-2 bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs text-gray-500">4.8</span>
                      </div>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">Popular</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Order Summary Section */}
      <div className="w-1/3 bg-gradient-to-br from-purple-50 to-pink-50 border-r border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Order</h2>
                <p className="text-gray-600 text-sm">
                  {orderItems.length} items selected
                </p>
              </div>
            </div>
            {orderItems.length > 0 && (
              <div className="flex items-center space-x-2 bg-purple-50 px-3 py-2 rounded-xl">
                <Heart className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">
                  Great choice!
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 h-[calc(100%-280px)] overflow-y-auto custom-scrollbar">
          {orderItems.length > 0 ? (
            <div className="space-y-4">
              {orderItems.map((item, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-center space-x-3">
                    {item.image && (
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-lg font-bold text-purple-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-2">
                      <button
                        onClick={() => handleQuantityChange(index, -1)}
                        className="p-1 rounded-full hover:bg-white transition-colors"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="font-semibold w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(index, 1)}
                        className="p-1 rounded-full hover:bg-white transition-colors"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-purple-200 rounded-full blur-xl opacity-50" />
                <div className="relative p-6 bg-white rounded-2xl shadow-lg">
                  <ShoppingBag className="w-12 h-12 text-purple-400 mx-auto" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-600">
                Add some delicious items from the menu to get started
              </p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        {orderItems.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-purple-600">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Checkout Section */}
      <div className="w-1/3 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="p-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
              <p className="text-gray-600 text-sm">Complete your order</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 h-[calc(100%-120px)] overflow-y-auto custom-scrollbar"
        >
          <div className="space-y-6">
            {/* Payment Method */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { method: "Credit Card", icon: CreditCard, color: "blue" },
                  { method: "Debit Card", icon: Wallet, color: "green" },
                  { method: "Cash", icon: DollarSign, color: "orange" },
                ].map(({ method, icon: Icon, color }) => (
                  <div
                    key={method}
                    onClick={() =>
                      setFormData({ ...formData, paymentMethod: method })
                    }
                    className={`p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                      formData.paymentMethod === method
                        ? `border-${color}-500 bg-${color}-50 shadow-lg shadow-${color}-200`
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 mb-2 mx-auto ${
                        formData.paymentMethod === method
                          ? `text-${color}-600`
                          : "text-gray-500"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium block text-center ${
                        formData.paymentMethod === method
                          ? `text-${color}-700`
                          : "text-gray-600"
                      }`}
                    >
                      {method}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Delivery Information
              </label>

              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter your delivery address"
                  value={formData.deliveryAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deliveryAddress: e.target.value,
                    })
                  }
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm hover:shadow-md"
                  required
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  placeholder="Your contact number"
                  value={formData.contactNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, contactNumber: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm hover:shadow-md"
                  required
                />
              </div>

              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                <textarea
                  placeholder="Special instructions (optional)"
                  value={formData.specialInstructions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specialInstructions: e.target.value,
                    })
                  }
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-24 resize-none transition-all shadow-sm hover:shadow-md"
                />
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="flex items-center p-4 bg-red-50 text-red-700 rounded-2xl border border-red-200 animate-shake">
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center p-4 bg-green-50 text-green-700 rounded-2xl border border-green-200 animate-slideIn">
                <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0" />
                <p className="font-medium">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || orderItems.length === 0}
              className={`w-full py-4 bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white rounded-2xl font-bold text-lg
    hover:from-orange-600 hover:via-red-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed 
    transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl
    flex items-center justify-center space-x-3`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Placing Order...</span>
                </>
              ) : (
                <>
                  <span>Place Order • ${finalTotal.toFixed(2)}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out;
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e0 #f7fafc;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f7fafc;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export { OrderForm, OrderModal };
