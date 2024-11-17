'use client'
import { useEffect, useState } from "react";
import { Search, Loader2, ChefHat, Store, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { get } from "@/utils/api";
import RestaurantCard from "@/components/RestaurantCard";

export default function Home(restaurantId) {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, loading, error, clearError, isLoggedIn } = useAuth();
  const [fetchingRestaurants, setFetchingRestaurants] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setFetchError(null);
        const data = await get("/restaurants");
        setRestaurants(data);
        setFilteredRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setFetchError(error.message || "Error Fetching Restaurants.");
      } finally {
        setFetchingRestaurants(false);
      }
    };

    if (isLoggedIn) {
      fetchRestaurants();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    return () => {
      if (error) {
        clearError();
      }
    };
  }, [error, clearError]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = restaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.description.toLowerCase().includes(query)
    );
    setFilteredRestaurants(filtered);
  };

  if (loading || fetchingRestaurants) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
          <p className="text-lg font-medium text-gray-600">Loading amazing dishes...</p>
        </div>
      </div>
    );
  }

  if (error || fetchError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full mx-4 p-6 bg-white rounded-xl shadow-lg border-l-4 border-red-500">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Error Occurred</h3>
              <p className="mt-1 text-sm text-gray-500">{error || fetchError}</p>
            </div>
          </div>
          {error && (
            <button
              onClick={clearError}
              className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              Dismiss Error
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
     

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="relative mb-12">
          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                Discover
              </span>
              <span className="text-gray-900"> Delicious Dishes</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 leading-relaxed">
              Explore our exquisite menu to satisfy your cravings, featuring the finest selection of cuisines.
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="relative max-w-2xl mx-auto mb-16">
          <div className={`relative transform transition-all duration-200 ${searchFocused ? 'scale-105' : ''}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl blur-lg opacity-20" />
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${searchFocused ? 'text-red-500' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search restaurants by name or cuisine..."
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Store className="w-4 h-4 text-red-500" />
                <span>{restaurants.length} Available</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <span>Top Rated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Grid */}
        <div className="mt-20">
          {filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRestaurants.map((restaurant) => (
                <div 
                  key={restaurant._id} 
                  className="group transform hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
                >
                  <RestaurantCard restaurant={restaurant} key={restaurant._id} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4">
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">No restaurants found</h3>
                <p className="text-gray-600 mb-8">
                  We couldn't find any restaurants matching your search. Try different keywords or browse our featured restaurants.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilteredRestaurants(restaurants);
                  }}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}