'use client'
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { get, post } from "@/utils/api";
import {
  Store,
  Coffee,
  MenuIcon,
  MapPin,
  Phone,
  Utensils,
  PlusCircle,
  Loader2,
  ChefHat,
  User,
  DollarSign,
  Star,
  BellRing,
  Settings,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Award,
  Clock,
  Eye,
  Edit3
} from "lucide-react";

import RestaurantMenuModal from "@/components/RestaurantMenuModel";
import MenuItemForm from "@/components/MenuItemForm";
import ErrorDisplay from "@/components/ErrorDisplay";

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMenuItemForm, setShowMenuItemForm] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [menuItems, setMenuItems] = useState({});
  const [selectedRestaurantDetails, setSelectedRestaurantDetails] = useState(null);
  const [error, setError] = useState(null);

  const MENU_CATEGORIES = ["Appetizer", "Main Course", "Dessert", "Beverage", "Snack"];

  const [menuItemForm, setMenuItemForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "Main Course",
    image: "",
  });

  const [totalStats, setTotalStats] = useState({
    menuItemsCount: 0,
    categoriesCount: 0,
    revenue: 0,
    customers: 0,
    revenueGrowth: 0,
    customerGrowth: 0
  });

  const calculateStats = async (restaurants) => {
    try {
      // Fetch menu stats
      const menuStats = await Promise.all(
        restaurants.map((restaurant) =>
          get(`/menu/owner-menu/${restaurant._id}`)
        )
      );

      // Calculate total menu items and categories
      const totalMenuItems = menuStats.reduce(
        (total, stat) => total + (stat.menuItems ? Object.values(stat.menuItems).flat().length : 0),
        0
      );

      const uniqueCategories = new Set(
        menuStats.flatMap((stat) =>
          stat.menuItems ? Object.keys(stat.menuItems) : []
        )
      );

      // Fetch orders for all restaurants
      const ordersData = await Promise.all(
        restaurants.map((restaurant) =>
          get(`/orders/restaurant/${restaurant._id}`)
        )
      );

      // Calculate total revenue and unique customers
      let totalRevenue = 0;
      const uniqueCustomers = new Set();
      const currentDate = new Date();
      const lastMonth = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
      let lastMonthRevenue = 0;
      let lastMonthCustomers = 0;

      ordersData.forEach(({ orders }) => {
        orders.forEach(order => {
          const orderDate = new Date(order.createdAt);
          const orderTotal = order.orderItems.reduce((total, item) => {
            return total + (item.menuItem.price * item.quantity);
          }, 0);

          totalRevenue += orderTotal;
          uniqueCustomers.add(order.user);

          // Calculate last month's stats for growth percentage
          if (orderDate >= lastMonth) {
            lastMonthRevenue += orderTotal;
            if (!lastMonthCustomers) {
              lastMonthCustomers++;
            }
          }
        });
      });

      // Calculate growth percentages
      const previousMonthRevenue = totalRevenue - lastMonthRevenue;
      const revenueGrowth = previousMonthRevenue !== 0 
        ? ((lastMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
        : 0;

      const previousMonthCustomers = uniqueCustomers.size - lastMonthCustomers;
      const customerGrowth = previousMonthCustomers !== 0 
        ? ((lastMonthCustomers - previousMonthCustomers) / previousMonthCustomers) * 100 
        : 0;

      setTotalStats({
        menuItemsCount: totalMenuItems,
        categoriesCount: uniqueCategories.size,
        revenue: totalRevenue,
        customers: uniqueCustomers.size,
        revenueGrowth: revenueGrowth.toFixed(1),
        customerGrowth: customerGrowth.toFixed(1)
      });
    } catch (error) {
      console.error("Error calculating stats:", error);
      handleError(error);
    }
  };

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
        handleError(error);
      }
    };

    initializeDashboard();
  }, [token, user, router]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await get("/restaurants/owner", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRestaurants(response);
      await calculateStats(response.restaurants);
      
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
      if (response?.menuItems) {
        setMenuItems(response.menuItems);
        setSelectedRestaurantDetails(response.restaurant);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleViewMenu = async (restaurantId) => {
    try {
      setSelectedRestaurantId(restaurantId);
      await fetchMenuItems(restaurantId);
    } catch (error) {
      handleError(error);
    }
  };

  const handleCreateMenuItem = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      if (!selectedRestaurantId || !menuItemForm.name || !menuItemForm.description || !menuItemForm.price || !menuItemForm.category) {
        setError("All fields are required");
        return;
      }

      const formData = new FormData();
      Object.entries(menuItemForm).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      formData.append("restaurantId", selectedRestaurantId);

      const response = await post("/menu/create-menu", Object.fromEntries(formData));

      if (response.success) {
        setShowMenuItemForm(false);
        setMenuItemForm({
          name: "",
          description: "",
          price: "",
          category: "Main Course",
          image: null,
        });
        await fetchMenuItems(selectedRestaurantId);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.status === 401) {
      logout();
      return;
    }
    setError(error.message || "An error occurred");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center space-y-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-2xl opacity-20 animate-pulse" />
              <div className="relative p-8 bg-white rounded-2xl shadow-xl">
                <ChefHat className="w-16 h-16 text-red-600 mb-4" />
                <Loader2 className="w-12 h-12 text-red-600 animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">Loading Dashboard</h2>
              <p className="text-gray-600 max-w-md">Preparing your restaurant management experience...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-orange-500/10 to-yellow-500/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg">
              <div className="p-2 bg-red-100 rounded-xl">
                <ChefHat className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-900">Restaurant Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.name || 'Chef'}!</p>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                  totalStats.revenueGrowth >= 0 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {totalStats.revenueGrowth >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{Math.abs(totalStats.revenueGrowth)}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <h3 className="text-3xl font-bold text-gray-900">${totalStats.revenue.toLocaleString()}</h3>
                <p className="text-xs text-gray-500">This month</p>
              </div>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  <Activity className="w-3 h-3" />
                  <span>Active</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Restaurants</p>
                <h3 className="text-3xl font-bold text-gray-900">{restaurants?.restaurants?.length || 0}</h3>
                <p className="text-xs text-gray-500">Total locations</p>
              </div>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Coffee className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                  <Award className="w-3 h-3" />
                  <span>{totalStats.categoriesCount} types</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Menu Items</p>
                <h3 className="text-3xl font-bold text-gray-900">{totalStats.menuItemsCount}</h3>
                <p className="text-xs text-gray-500">Across all restaurants</p>
              </div>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12.5%</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Customers</p>
                <h3 className="text-3xl font-bold text-gray-900">{totalStats.customers}</h3>
                <p className="text-xs text-gray-500">Total served</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurants Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Restaurants</h2>
              <p className="text-gray-600">Manage your restaurant locations and menus</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg border border-white/20">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-700">All systems operational</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants?.restaurants?.map((restaurant, index) => (
            <div
              key={restaurant._id}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20 overflow-hidden opacity-0 animate-fade-in-up"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'forwards'
              }}
            >
              {/* Restaurant Header */}
              <div className="relative p-6 bg-gradient-to-br from-red-500/10 to-orange-500/10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                
                <div className="relative flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <ChefHat className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                        {restaurant.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {restaurant.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-green-700">Live</span>
                  </div>
                </div>

                {/* Restaurant Details */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-700 font-medium line-clamp-1">{restaurant.address}</p>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-700 font-medium">{restaurant.phone}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 bg-white/40 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleViewMenu(restaurant._id)}
                    className="group/btn flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                  >
                    <Eye className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
                    View Menu
                  </button>
                  
                  <button
                    onClick={() => {
                      setSelectedRestaurantId(restaurant._id);
                      setShowMenuItemForm(true);
                    }}
                    className="group/btn flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                  >
                    <PlusCircle className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {restaurants?.restaurants?.length === 0 && (
          <div className="text-center py-20">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gray-200 rounded-full blur-xl opacity-50" />
              <div className="relative p-8 bg-white rounded-2xl shadow-lg">
                <Store className="w-16 h-16 text-gray-400 mx-auto" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No restaurants yet</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Start by adding your first restaurant to begin managing your culinary empire.
            </p>
            <button className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              Add Restaurant
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedRestaurantId && selectedRestaurantDetails && (
        <RestaurantMenuModal
          selectedRestaurant={selectedRestaurantId}
          selectedRestaurantDetails={selectedRestaurantDetails}
          menuItems={menuItems}
          onClose={() => {
            setSelectedRestaurantId(null);
            setSelectedRestaurantDetails(null);
            setMenuItems({});
          }}
        />
      )}

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

      {error && (
        <ErrorDisplay
          message={error}
          onClose={() => setError(null)}
          variant="toast"
          position="top-right"
          duration={2000}
        />
      )}

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;