"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { get, post } from "@/utils/api";
import {
  Store,
  PlusCircle,
  Menu as MenuIcon,
  X,
  Coffee,
  Image as ImageIcon,
  AlertCircle,
  ChevronRight,
  Utensils,
  DollarSign,
  MapPin,
  Phone,
  Loader2,
} from "lucide-react";

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  // State management
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showMenuItemForm, setShowMenuItemForm] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState({});
  const [selectedRestaurantDetails, setSelectedRestaurantDetails] =
    useState(null);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Form states
  const [restaurantForm, setRestaurantForm] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
  });

  const [menuItemForm, setMenuItemForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        if (!token) {
          router.push("/login");
          return;
        }

        if (user?.role !== "owner") {
          router.push("/");
          return;
        }

        await fetchRestaurants();
      } catch (error) {
        console.error("Dashboard initialization error:", error);
        if (error.message?.includes("Token expired")) {
          logout();
          return;
        }
        setError(error.message || "Failed to initialize dashboard");
      }
    };

    initializeDashboard();
  }, [token, user, router]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await get("/restaurants/owner", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Restaurant fetch response:", response);
      setRestaurants(response);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async (restaurantId) => {
    try {
      setError(null);
      const response = await get(`/menu/owner-menu/${restaurantId}`);
      console.log("Menu:" + response);

      setMenuItems(response.menuItems);
      setSelectedRestaurantDetails(response.restaurant);
      console.log("Menu items:", response);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.status === 401) {
      localStorage.removeItem("token");
      router.push("/login");
      return;
    }

    if (error.status === 403) {
      setError("Access denied. Please make sure you have owner permissions.");
      return;
    }

    if (error.message?.includes("Token expired")) {
      logout();
      return;
    }

    setError(error.message || "An error occurred");
  };

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    try {
      setError(null);

      const { name, description, address, phone } = restaurantForm;
      if (
        !name.trim() ||
        !description.trim() ||
        !address.trim() ||
        !phone.trim()
      ) {
        setError("All fields are required");
        return;
      }

      const newRestaurant = {
        name: name.trim(),
        description: description.trim(),
        address: address.trim(),
        phone: phone.trim(),
      };

      const response = await post(
        "/restaurants/create-restaurant",
        newRestaurant
      );
      console.log("Create restaurant response:", response);

      setShowCreateForm(false);
      setRestaurantForm({
        name: "",
        description: "",
        address: "",
        phone: "",
      });

      await fetchRestaurants();
    } catch (error) {
      console.error("Error creating restaurant:", error);
      handleError(error);
    }
  };

  const handleCreateMenuItem = async (e) => {
    e.preventDefault();
    try {
      setError(null);

      const formData = new FormData();

      if (
        !menuItemForm.name ||
        !menuItemForm.description ||
        !menuItemForm.price ||
        !menuItemForm.category
      ) {
        setError("Name, description, price, and category are required");
        return;
      }

      Object.keys(menuItemForm).forEach((key) => {
        if (menuItemForm[key] !== null) {
          formData.append(key, menuItemForm[key]);
        }
      });

      formData.append("restaurantId", selectedRestaurant);

      const formDataObject = formDataToObject(formData);
      console.log("FormData Object:", formDataObject);

      const response = await post("/menu/create-menu", formDataObject);

      if (response.success) {
        setShowMenuItemForm(false);
        setMenuItemForm({
          name: "",
          description: "",
          price: "",
          category: "",
          image: null,
        });
        fetchMenuItems(selectedRestaurant);
      } else {
        setError("Failed to create menu item.");
      }
    } catch (error) {
      console.error("Error creating menu item:", error);
      handleError(error);
    }
  };

  const formDataToObject = (formData) => {
    const obj = {};
    formData.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-red-500 animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">
            Loading your restaurants...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-12">
      {/* Stats Overview */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">
                    Total Restaurants
                  </p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">
                    {restaurants?.restaurants?.length || 0}
                  </h3>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <Store className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">
                    Total Menu Items
                  </p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">
                    {Object.values(menuItems).flat().length || 0}
                  </h3>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <Coffee className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">
                    Active Categories
                  </p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">
                    {Object.keys(menuItems).length || 0}
                  </h3>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <MenuIcon className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 rounded-r-lg flex items-center animate-slideIn">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Restaurant Dashboard
            </h1>
            <p className="text-gray-600">Manage your restaurants and menus</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Create Restaurant
          </button>
        </div>

        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {restaurants?.restaurants?.map((restaurant) => (
            <div
              key={restaurant._id}
              className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Restaurant Header Section */}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-red-500/10 to-orange-500/10" />

              <div className="relative p-6">
                {/* Restaurant Status Indicator */}
                <div className="absolute top-0 right-0 mr-6 mt-4">
                  <div className="flex items-center space-x-1">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-green-600 font-medium">
                      Active
                    </span>
                  </div>
                </div>

                {/* Restaurant Info */}
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
                        <Store className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-500 transition-colors duration-200 truncate">
                        {restaurant.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                        {restaurant.description}
                      </p>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <div className="flex items-center space-x-3 text-gray-600 group/item hover:text-gray-900 transition-colors duration-200">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-50 group-hover/item:bg-gray-100 transition-colors duration-200 flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <p
                        className="text-sm flex-1 truncate"
                        title={restaurant.address}
                      >
                        {restaurant.address}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 text-gray-600 group/item hover:text-gray-900 transition-colors duration-200">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-50 group-hover/item:bg-gray-100 transition-colors duration-200 flex items-center justify-center">
                        <Phone className="w-4 h-4" />
                      </div>
                      <p className="text-sm flex-1" title={restaurant.phone}>
                        {restaurant.phone}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 flex space-x-3">
                    <button
                      onClick={() => {
                        setSelectedRestaurant(restaurant._id);
                        fetchMenuItems(restaurant._id);
                      }}
                      className="flex-1 flex items-center justify-center px-4 py-2.5 bg-gradient-to-br from-emerald-500 to-green-500 text-white rounded-lg 
                hover:from-emerald-600 hover:to-green-600 
                transition-all duration-300 transform hover:scale-[1.02]
                shadow-sm hover:shadow-md hover:shadow-green-500/25
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      <Utensils className="w-4 h-4 mr-2" />
                      <span className="font-medium">View Menu</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedRestaurant(restaurant._id);
                        setShowMenuItemForm(true);
                      }}
                      className="flex-1 flex items-center justify-center px-4 py-2.5 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg 
                hover:from-blue-600 hover:to-blue-700
                transition-all duration-300 transform hover:scale-[1.02]
                shadow-sm hover:shadow-md hover:shadow-blue-500/25
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      <span className="font-medium">Add Item</span>
                    </button>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-gray-100 to-transparent opacity-50 pointer-events-none" />
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-tl from-red-500/5 to-transparent pointer-events-none" />
              </div>
            </div>
          ))}
        </div>

        {/* Menu Items Display */}
        {selectedRestaurant && selectedRestaurantDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            {/* Modal Container */}
            <div className="bg-white w-full max-w-5xl mx-auto rounded-lg shadow-lg overflow-hidden relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedRestaurant(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Header Section */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800">
                  Menu - {selectedRestaurantDetails.name}
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  Explore the delicious menu offerings from{" "}
                  {selectedRestaurantDetails.name}.
                </p>
              </div>

              {/* Menu Categories and Items */}
              <div className="p-6 overflow-y-auto max-h-[80vh]">
                {Object.entries(menuItems).map(([category, items]) => (
                  <div key={category} className="mb-8">
                    {/* Category Header */}
                    <h3 className="text-2xl font-semibold mb-4 text-gray-700 border-b-2 border-gray-200 pb-2">
                      {category}
                    </h3>

                    {/* Menu Items Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {items.map((item) => (
                        <div
                          key={item._id}
                          className="bg-white rounded-lg shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-105"
                        >
                          {/* Item Image */}
                          {item.image && (
                            <div className="relative">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-48 object-cover rounded-t-lg"
                              />
                              <span className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                Featured
                              </span>
                            </div>
                          )}

                          {/* Item Details */}
                          <div className="p-4">
                            <h4 className="text-lg font-bold text-gray-800 mb-2">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {item.description}
                            </p>
                            <p className="text-lg font-semibold text-purple-600">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Create Restaurant Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Create Restaurant</h2>
              <form onSubmit={handleCreateRestaurant} className="space-y-4">
                <input
                  type="text"
                  placeholder="Restaurant Name"
                  className="w-full p-2 border rounded"
                  value={restaurantForm.name}
                  onChange={(e) =>
                    setRestaurantForm({
                      ...restaurantForm,
                      name: e.target.value,
                    })
                  }
                />
                <textarea
                  placeholder="Description"
                  className="w-full p-2 border rounded"
                  value={restaurantForm.description}
                  onChange={(e) =>
                    setRestaurantForm({
                      ...restaurantForm,
                      description: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Address"
                  className="w-full p-2 border rounded"
                  value={restaurantForm.address}
                  onChange={(e) =>
                    setRestaurantForm({
                      ...restaurantForm,
                      address: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Phone"
                  className="w-full p-2 border rounded"
                  value={restaurantForm.phone}
                  onChange={(e) =>
                    setRestaurantForm({
                      ...restaurantForm,
                      phone: e.target.value,
                    })
                  }
                />
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Menu Item Modal */}
        {showMenuItemForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Create Menu Item</h2>
              <form onSubmit={handleCreateMenuItem} className="space-y-4">
                <input
                  type="text"
                  placeholder="Menu Item Name"
                  className="w-full p-2 border rounded"
                  value={menuItemForm.name}
                  onChange={(e) =>
                    setMenuItemForm({ ...menuItemForm, name: e.target.value })
                  }
                />
                <textarea
                  placeholder="Description"
                  className="w-full p-2 border rounded"
                  value={menuItemForm.description}
                  onChange={(e) =>
                    setMenuItemForm({
                      ...menuItemForm,
                      description: e.target.value,
                    })
                  }
                />
                <input
                  type="number"
                  placeholder="Price"
                  className="w-full p-2 border rounded"
                  value={menuItemForm.price}
                  onChange={(e) =>
                    setMenuItemForm({ ...menuItemForm, price: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Category"
                  className="w-full p-2 border rounded"
                  value={menuItemForm.category}
                  onChange={(e) =>
                    setMenuItemForm({
                      ...menuItemForm,
                      category: e.target.value,
                    })
                  }
                />
                <input
                  type="file"
                  accept="image/*"
                  className="w-full p-2 border rounded"
                  onChange={(e) =>
                    setMenuItemForm({
                      ...menuItemForm,
                      image: e.target.files[0],
                    })
                  }
                />
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowMenuItemForm(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
