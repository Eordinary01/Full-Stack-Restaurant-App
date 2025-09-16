import React, { useState } from "react";
import { X, ChefHat, Star, Clock, Heart, Award, Users, MapPin, Phone, Globe, Sparkles } from "lucide-react";

const RestaurantMenuModal = ({
  selectedRestaurant,
  selectedRestaurantDetails,
  menuItems,
  onClose,
  selectedRestaurantForMenu,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(
    Object.keys(menuItems)[0]
  );
  const [favorites, setFavorites] = useState(new Set());

  const toggleFavorite = (itemId) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId);
      } else {
        newFavorites.add(itemId);
      }
      return newFavorites;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white w-full max-w-7xl mx-4 rounded-3xl shadow-2xl overflow-hidden relative transform transition-all max-h-[90vh] flex flex-col">
        {/* Enhanced Header with Restaurant Info */}
        <div className="relative bg-gradient-to-br from-red-500 via-orange-500 to-pink-600 p-8 text-white overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-2xl" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
                  <ChefHat className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold tracking-tight mb-2">
                    {selectedRestaurantDetails.name}
                  </h2>
                  <p className="text-white/90 text-lg max-w-2xl">
                    {selectedRestaurantDetails.description || "Experience exceptional dining with carefully crafted dishes"}
                  </p>
                </div>
              </div>
              
              
            </div>

            {/* Restaurant Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                </div>
                <div className="text-2xl font-bold">4.8</div>
                <div className="text-sm text-white/80">Rating</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-blue-300" />
                </div>
                <div className="text-2xl font-bold">25-35</div>
                <div className="text-sm text-white/80">Minutes</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-green-300" />
                </div>
                <div className="text-2xl font-bold">2.4k</div>
                <div className="text-sm text-white/80">Reviews</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="w-5 h-5 text-purple-300" />
                </div>
                <div className="text-2xl font-bold">Top</div>
                <div className="text-sm text-white/80">Rated</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Category Navigation */}
        <div className="border-b border-gray-100 px-8 py-4 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {Object.keys(menuItems).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-200 scale-105"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {category}
                <span className="ml-2 text-xs opacity-75">
                  ({menuItems[category]?.length || 0})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Menu Items */}
        <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-gray-50 to-white">
          {menuItems[selectedCategory] && menuItems[selectedCategory].length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {menuItems[selectedCategory]?.map((item, index) => (
                <div
                  key={item._id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden hover:-translate-y-2 opacity-0 animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'forwards'
                  }}
                >
                  {/* Enhanced Item Image */}
                  {item?.image && (
                    <div className="relative overflow-hidden">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Enhanced Badges */}
                      <div className="absolute top-4 left-4 flex flex-col space-y-2">
                        {item.isSpicy && (
                          <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-2 rounded-full flex items-center shadow-lg backdrop-blur-sm">
                            🌶️ Spicy
                          </span>
                        )}
                        {item.isVegan && (
                          <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg backdrop-blur-sm">
                            🌱 Vegan
                          </span>
                        )}
                        {item.isPopular && (
                          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg backdrop-blur-sm">
                            ⭐ Popular
                          </span>
                        )}
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={() => toggleFavorite(item._id)}
                        className="absolute top-4 right-4 p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white hover:scale-110 transition-all duration-300"
                      >
                        <Heart
                          className={`w-5 h-5 transition-all duration-300 ${
                            favorites.has(item._id)
                              ? "fill-red-500 text-red-500 scale-110"
                              : "text-gray-600"
                          }`}
                        />
                      </button>
                    </div>
                  )}

                  {/* Enhanced Item Details */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                        {item.name}
                      </h4>
                      <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-yellow-700">4.8</span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-gray-900">
                          ${item.price.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">Per serving</p>
                      </div>
                      
                      <button className="group/btn bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <span className="group-hover/btn:scale-110 transition-transform duration-200">
                          Add to Cart
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gray-200 rounded-full blur-xl opacity-50" />
                <div className="relative p-8 bg-white rounded-2xl shadow-lg">
                  <ChefHat className="w-16 h-16 text-gray-400" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">No Menu Items Yet</h3>
              <p className="text-gray-600 text-lg max-w-md mb-8">
                This category is waiting for delicious items to be added. Start building your menu!
              </p>
              <button className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Add Menu Items
              </button>
            </div>
          )}
        </div>

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
          
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default RestaurantMenuModal;