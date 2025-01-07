import React, { useState } from 'react';
import { X, ChefHat, Star, Clock, Heart } from 'lucide-react';

const RestaurantMenuModal = ({ selectedRestaurant, selectedRestaurantDetails, menuItems, onClose,selectedRestaurantForMenu }) => {
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(menuItems)[0]);
  const [favorites, setFavorites] = useState(new Set());

  const toggleFavorite = (itemId) => {
    setFavorites(prev => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-6xl mx-4 rounded-2xl shadow-2xl overflow-hidden relative transform transition-all">
        {/* Header with Restaurant Info */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <ChefHat className="w-8 h-8" />
              <h2 className="text-3xl font-bold tracking-tight">{selectedRestaurantDetails.name}</h2>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center bg-white/20 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 mr-1 text-yellow-300" />
                <span>4.8 (2.4k reviews)</span>
              </div>
              <div className="flex items-center bg-white/20 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4 mr-1" />
                <span>30-45 min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="border-b border-gray-200 px-6 py-3 overflow-x-auto bg-gray-50">
          <div className="flex space-x-4">
            {Object.keys(menuItems).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-300px)] bg-gray-50">
  {menuItems[selectedCategory] && menuItems[selectedCategory].length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {menuItems[selectedCategory]?.map((item) => (
        <div
          key={item._id}
          className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
          {/* Item Image */}
          {item.image && (
            <div className="relative overflow-hidden rounded-t-xl">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex space-x-2">
                {item.isSpicy && (
                  <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                    Spicy 🌶️
                  </span>
                )}
                {item.isVegan && (
                  <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Vegan 🌱
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Item Details */}
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg font-bold text-gray-800">{item.name}</h4>
              <button
                onClick={() => toggleFavorite(item._id)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${
                    favorites.has(item._id)
                      ? 'fill-orange-500 text-orange-500'
                      : 'text-gray-400'
                  }`}
                />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {item.description}
            </p>

            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-blue-600">
                ${item.price.toFixed(2)}
              </p>
              <button className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-full hover:bg-orange-600 transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="flex justify-center items-center h-full text-gray-950 text-lg">
      Menu not added!! Pls Add
    </div>
  )}
</div>


        {/* Bottom Banner - Redesigned without claim functionality */}
       
        
      </div>
    </div>
  );
};

export default RestaurantMenuModal;