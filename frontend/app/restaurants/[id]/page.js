"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import MenuItemCard from "../../../components/MenuItemCard";
import { get } from "@/utils/api";
import { MapPin, Phone, Clock, ChefHat, Plus, PenSquare } from "lucide-react";
import RestaurantBanner from "@/components/RestaurantBanner";
import { OrderModal,OrderForm } from "@/components/OrderForm";


export default function RestaurantDetails({ params }) {
  const resolvedParams = use(params);
  const restaurantId = resolvedParams.id;
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user, role } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      if (!restaurantId) {
        setError("Restaurant ID is missing");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const [restaurantData, menuItemsData] = await Promise.all([
          get(`/restaurants/${restaurantId}`),
          get(`/menu/restaurant/${restaurantId}`),
        ]);

        setRestaurant(restaurantData);
        setMenuItems(menuItemsData);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message || "Failed to load restaurant details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-700">
            Loading amazing flavors...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-6 border border-red-100">
          <div className="flex items-center space-x-4 text-red-600">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                Error Loading Restaurant
              </h3>
              <p className="text-sm opacity-90">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-6">
          <div className="text-center">
            <ChefHat className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">
              Restaurant Not Found
            </h2>
            <p className="mt-2 text-gray-500">
              We couldn't find the restaurant you're looking for.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const categories = [
    "all",
    ...new Set(menuItems.map((item) => item.category)),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative h-72 ">
        <RestaurantBanner restaurant={restaurant} />
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="container mx-auto px-4 h-full flex items-end pb-8 relative z-10">
          <div className="w-full">
            <h1 className="text-4xl font-bold text-white mb-2">
              {restaurant.name}
            </h1>
            <p className="text-white/90 text-lg max-w-2xl">
              {restaurant.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-16 relative z-20">
        {/* Info Card */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900">
                  {restaurant.address}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium text-gray-900">{restaurant.phone}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Hours</p>
                <p className="font-medium text-gray-900">9:00 AM - 10:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Our Menu</h2>
            <div className="flex space-x-4">
              {user.role === "owner" ? (
                <>
                  <button
                    onClick={() =>
                      router.push(`/restaurants/${restaurantId}/edit`)
                    }
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <PenSquare className="w-4 h-4" />
                    <span>Edit Restaurant</span>
                  </button>
                  <button
                    onClick={() =>
                      router.push(`/restaurants/${restaurantId}/menu/add`)
                    }
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Menu Item</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsOrderModalOpen(true)}
                  className="flex items-center space-x-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  Order Now
                </button>
              )}
            </div>
          </div>

          <OrderModal
            isOpen={isOrderModalOpen}
            onClose={() => setIsOrderModalOpen(false)}
          >
            <OrderForm
              menuItems={menuItems}
              restaurantId={restaurantId}
              onClose={() => setIsOrderModalOpen(false)}
            />
          </OrderModal>
          {/* Category Filter */}
          <div className="flex overflow-x-auto pb-4 mb-6 gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  activeCategory === category
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {menuItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems
                .filter(
                  (item) =>
                    activeCategory === "all" || item.category === activeCategory
                )
                .map((item) => (
                  <MenuItemCard
                    key={item.id}
                    menuItem={item}
                    isAdmin={role === "admin"}
                    restaurantId={restaurantId}
                  />
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ChefHat className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No menu items available yet.</p>
              {role === "admin" && (
                <button
                  onClick={() =>
                    router.push(`/restaurants/${restaurantId}/menu/add`)
                  }
                  className="mt-4 inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add your first menu item</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
