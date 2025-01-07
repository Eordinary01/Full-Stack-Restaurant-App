"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { get, post } from "@/utils/api";
import {
  Card,
  CardHeader,
  Clock,
   ShoppingBag, 
  ForkKnife,
  Button,
  Select,
  Store,
  PlusCircle,
  Menu as MenuIcon,
  X,
  Coffee,
  Image as ImageIcon,
  AlertCircle,
  Utensils,
  DollarSign,
  MapPin,
  Phone,
  Loader2,
} from "lucide-react";

import RestaurantMenuModal from "@/components/RestaurantMenuModel";
import MenuItemForm from "@/components/MenuItemForm";
import ErrorDisplay from "@/components/ErrorDisplay";

export const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showMenuItemForm, setShowMenuItemForm] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [menuItems, setMenuItems] = useState({});
  const [selectedRestaurantDetails, setSelectedRestaurantDetails] =
    useState(null);
  const [error, setError] = useState(null);

 
  const [activeTab, setActiveTab] = useState("restaurants"); // 'restaurants' or 'orders'
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStats, setOrderStats] = useState({});
  const [orders, setOrders] = useState([]);

  const [restaurantForm, setRestaurantForm] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
  });

  const MENU_CATEGORIES = [
    "Appetizer",
    "Main Course",
    "Dessert",
    "Beverage",
    "Snack",
  ];

  const [menuItemForm, setMenuItemForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "Main Course",
    image: null,
  });

  const [totalStats, setTotalStats] = useState({
    menuItemsCount: 0,
    categoriesCount: 0,
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
        // await fetchOrders();
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

  // const fetchOrders= async (id) => {
  //   console.log("Fetching order with ID:", id);
  //   try {
  //     const response = await get(`/orders/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  
  //     // Log the response to verify the data
  //     console.log("Fetched order:", response.order);
  
  //     // Check if response contains the order
  //     if (response.order) {
  //       // Set the order in state (assuming you want to display a single order)
  //       setOrders(response.order);
  
  //       // Optionally calculate stats for the single order
  //       const stats = {
  //         pending: response.order.status === "Pending" ? 1 : 0,
  //         processing: ["Confirmed", "Preparing", "Ready", "Out for Delivery"].includes(
  //           response.order.status
  //         )
  //           ? 1
  //           : 0,
  //         completed: response.order.status === "Delivered" ? 1 : 0,
  //       };
  
  //       // Log the stats for debugging
  //       console.log("Order stats:", stats);
  
  //       // Set the order stats in state
  //       setOrderStats(stats);
  //     } else {
  //       console.error("Error: Order data is not in the expected format");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching order by ID:", error);
  //     handleError(error);
  //   }
  // };
  
  
  // const updateOrderStatus = async (orderId, status) => {
  //   try {
  //     // Log the status change to verify
  //     console.log(`Updating order ${orderId} to status: ${status}`);
  
  //     await patch(`/orders/${orderId}/status`, { status });
  
  //     // Refresh orders after status update
  //     await fetchOrders(); // Refresh orders
  //     setError(null); // Clear any errors
  //   } catch (error) {
  //     console.error("Error updating order status:", error);
  //     handleError(error);
  //   }
  // };
  // const cancelOrder = async (orderId) => {
  //   try {
  //     await patch(`/orders/${orderId}/status`, { status: "Cancelled" });
  //     await fetchOrders(); // Refresh orders
  //     setError(null);
  //   } catch (error) {
  //     console.error("Error cancelling order:", error);
  //     handleError(error);
  //   }
  // };

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

      setRestaurants(response);

      const menuStats = await Promise.all(
        response.restaurants.map((restaurant) =>
          get(`/menu/owner-menu/${restaurant._id}`)
        )
      );

      // Calculate totals
      const totalMenuItems = menuStats.reduce(
        (total, stat) =>
          total +
          (stat.menuItems ? Object.values(stat.menuItems).flat().length : 0),
        0
      );

      const uniqueCategories = new Set(
        menuStats.flatMap((stat) =>
          stat.menuItems ? Object.keys(stat.menuItems) : []
        )
      );

      setTotalStats({
        menuItemsCount: totalMenuItems,
        categoriesCount: uniqueCategories.size,
      });
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

      if (response && response.menuItems) {
        setMenuItems(response.menuItems);
        setSelectedRestaurantDetails(response.restaurant);
      } else {
        throw new Error("Invalid menu data received");
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
      handleError(error);
    }
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

  const handleViewMenu = async (restaurantId) => {
    try {
      setSelectedRestaurantId(restaurantId);
      await fetchMenuItems(restaurantId);
    } catch (error) {
      console.error("Error viewing menu:", error);
      handleError(error);
    }
  };

  const handleCreateMenuItem = async (e) => {
    e.preventDefault();
    try {
      setError(null);

      if (!selectedRestaurantId) {
        setError("No restaurant selected");
        return;
      }

      if (
        !menuItemForm.name ||
        !menuItemForm.description ||
        !menuItemForm.price ||
        !menuItemForm.category
      ) {
        setError("Name, description, price, and category are required");
        return;
      }

      const formData = new FormData();
      formData.append("name", menuItemForm.name);
      formData.append("description", menuItemForm.description);
      formData.append("price", menuItemForm.price);
      formData.append("category", menuItemForm.category);
      formData.append("restaurantId", selectedRestaurantId);
      if (menuItemForm.image) {
        formData.append("image", menuItemForm.image);
      }

      formData.append("restaurantId", selectedRestaurantId);

      const formDataObject = formDataToObject(formData);
      const response = await post("/menu/create-menu", formDataObject);

      if (response.success) {
        setShowMenuItemForm(false);
        setMenuItemForm({
          name: "",
          description: "",
          price: "",
          category: "Main Course",
          image: null,
        });
        // Refresh menu items for the current restaurant
        await fetchMenuItems(selectedRestaurantId);
      } else {
        setError("Failed to create menu item.");
      }
    } catch (error) {
      console.error("Error creating menu item:", error);
      handleError(error);
    }
  };

  const handleCloseMenu = () => {
    setSelectedRestaurantId(null);
    setSelectedRestaurantDetails(null);
    setMenuItems({});
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

  const formDataToObject = (formData) => {
    const obj = {};
    formData.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  };

  // const renderOrdersSection = () => {
  //   return (
  //     <div className="space-y-6">
  //       {/* Render the stats section */}
  //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  //         <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
  //           <div className="flex items-center justify-between">
  //             <div>
  //               <p className="text-yellow-600 text-sm font-medium">Pending Orders</p>
  //               <h3 className="text-2xl font-bold text-gray-800 mt-1">{orderStats.pending}</h3>
  //             </div>
  //             <div className="bg-yellow-500/10 p-3 rounded-lg">
  //               <Clock className="w-6 h-6 text-yellow-500" />
  //             </div>
  //           </div>
  //         </div>
  
  //         <div className="bg-blue-50 p-6 rounded-lg shadow-md">
  //           <div className="flex items-center justify-between">
  //             <div>
  //               <p className="text-blue-600 text-sm font-medium">Processing Orders</p>
  //               <h3 className="text-2xl font-bold text-gray-800 mt-1">{orderStats.processing}</h3>
  //             </div>
  //             <div className="bg-blue-500/10 p-3 rounded-lg">
  //               <ShoppingBag className="w-6 h-6 text-blue-500" />
  //             </div>
  //           </div>
  //         </div>
  
  //         <div className="bg-green-50 p-6 rounded-lg shadow-md">
  //           <div className="flex items-center justify-between">
  //             <div>
  //               <p className="text-green-600 text-sm font-medium">Completed Orders</p>
  //               <h3 className="text-2xl font-bold text-gray-800 mt-1">{orderStats.completed}</h3>
  //             </div>
  //             <div className="bg-green-500/10 p-3 rounded-lg">
  //               <ForkKnife className="w-6 h-6 text-green-500" />
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  
  //       {/* Render the orders table */}
  //       <div className="bg-white rounded-xl shadow-sm overflow-hidden">
  //         <div className="overflow-x-auto">
  //           <table className="w-full">
  //             <thead className="bg-gray-50">
  //               <tr>
  //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
  //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
  //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
  //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
  //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
  //               </tr>
  //             </thead>
  //             <tbody className="bg-white divide-y divide-gray-200">
  //               {orders.map((order) => (
  //                 <tr key={order._id} className="hover:bg-gray-50">
  //                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order._id.slice(-6)}</td>
  //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.restaurant.name}</td>
  //                   <td className="px-6 py-4 whitespace-nowrap">
  //                     <span
  //                       className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
  //                       ${order.status === 'Delivered'
  //                         ? 'bg-green-100 text-green-800'
  //                         : order.status === 'Pending'
  //                         ? 'bg-yellow-100 text-yellow-800'
  //                         : 'bg-blue-100 text-blue-800'}`}
  //                     >
  //                       {order.status}
  //                     </span>
  //                   </td>
  //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.totalAmount}</td>
  //                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
  //                     <Select
  //                       value={order.status}
  //                       onChange={(e) => updateOrderStatus(order._id, e.target.value)}
  //                       disabled={order.status === 'Cancelled' || order.status === 'Delivered'}
  //                     >
  //                       <option value="Pending">Pending</option>
  //                       <option value="Confirmed">Confirmed</option>
  //                       <option value="Preparing">Preparing</option>
  //                       <option value="Ready">Ready</option>
  //                       <option value="Out for Delivery">Out for Delivery</option>
  //                       <option value="Delivered">Delivered</option>
  //                     </Select>
  //                     {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
  //                       <Button
  //                         onClick={() => cancelOrder(order._id)}
  //                         className="text-red-600 hover:text-red-900 mt-2"
  //                       >
  //                         Cancel
  //                       </Button>
  //                     )}
  //                   </td>
  //                 </tr>
  //               ))}
  //             </tbody>
  //           </table>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

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
          <div className="flex space-x-4 mb-8">
            {/* <button
              onClick={() => setActiveTab("restaurants")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors
              ${
                activeTab === "restaurants"
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Restaurants
            </button> */}
            {/* <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors
              ${
                activeTab === "orders"
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Orders
            </button> */}
          </div>

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
                    {totalStats.menuItemsCount}
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
                    {totalStats.categoriesCount}
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
          <ErrorDisplay
            message={error}
            onClose={() => setError(null)}
            variant="toast"
            position="top-right"
            duration={2000}
          />
        )}

        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Restaurant Dashboard
            </h1>
            <p className="text-gray-600">Manage your restaurants and menus</p>
          </div>
          {/* <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Create Restaurant
          </button> */}
        </div>
        {/* Restaurants Grid */}
        {activeTab === 'restaurants' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {restaurants?.restaurants?.map((restaurant) => (
            <div
              key={restaurant._id}
              value={restaurant.id}
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
                      onClick={() => handleViewMenu(restaurant._id)}
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
                        setSelectedRestaurantId(restaurant._id);
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
              </div>
            </div>
          ))}

          {/* Menu Items Display */}
          {selectedRestaurantId && selectedRestaurantDetails && (
            <RestaurantMenuModal
              selectedRestaurant={selectedRestaurantId}
              selectedRestaurantDetails={selectedRestaurantDetails}
              menuItems={menuItems}
              onClose={handleCloseMenu}
            />
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
            <MenuItemForm
              showMenuItemForm={showMenuItemForm}
              setShowMenuItemForm={setShowMenuItemForm}
              menuItemForm={menuItemForm}
              setMenuItemForm={setMenuItemForm}
              handleCreateMenuItem={handleCreateMenuItem}
              MENU_CATEGORIES={MENU_CATEGORIES}
            />
          )}
        </div>
        ):(
          renderOrdersSection()
        )}
      </div>
    </div>
  );
};

export default Dashboard;
