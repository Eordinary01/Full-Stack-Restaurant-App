import React, { useState } from 'react';
import { ChefHat, Edit, Trash2, ShoppingBag, Clock, Star, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MenuItemCard({ menuItem, isAdmin, restaurantId }) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleEdit = (e) => {
    e.stopPropagation();
    router.push(`/restaurants/${restaurantId}/menu/${menuItem.id}/edit`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    // Add your delete logic here
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await fetch(`/api/restaurants/${restaurantId}/menu/${menuItem.id}`, {
          method: 'DELETE',
        });
        // Refresh the page or update the state
        router.refresh();
      } catch (error) {
        console.error('Error deleting menu item:', error);
      }
    }
  };

  return (
    <div
      className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-100 to-blue-50">
        {menuItem.image ? (
          <img
            src={menuItem.image}
            alt={menuItem.name}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ChefHat className="w-16 h-16 text-gray-400" />
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700">
            {menuItem.category}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-1 bg-green-500 px-3 py-1 rounded-full text-white font-semibold">
            <DollarSign className="w-4 h-4" />
            <span>{menuItem.price.toFixed(2)}</span>
          </div>
        </div>

        {/* Dietary Labels */}
        {menuItem.dietary && menuItem.dietary.length > 0 && (
          <div className="absolute bottom-4 left-4 flex gap-2">
            {menuItem.dietary.map((diet) => (
              <span
                key={diet}
                className="px-2 py-1 bg-blue-500/90 backdrop-blur-sm rounded-full text-xs text-white"
              >
                {diet}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 group-hover:text-orange-500 transition-colors mb-2">
          {menuItem.name}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {menuItem.description}
        </p>

        {/* Stats Row */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">15-20 min</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-500">4.8</span>
          </div>
        </div>

        {/* Action Buttons Overlay */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent 
            transition-opacity duration-300 flex items-end justify-center pb-6 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex space-x-3">
            {isAdmin ? (
              <>
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </>
            ) : (
              <button 
                className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
                onClick={() => {
                  // Add to cart functionality here
                  // console.log('Add to cart:', menuItem);
                }}
              >
                <ShoppingBag className="w-4 h-4" />
                <span></span>
              </button>
            )}
          </div>
        </div>

        {/* Spiciness Indicator */}
        {menuItem.spicyLevel && (
          <div className="absolute top-4 right-20">
            <div className="flex items-center space-x-1 bg-red-500/90 backdrop-blur-sm px-2 py-1 rounded-full">
              {[...Array(menuItem.spicyLevel)].map((_, i) => (
                <span key={i} className="text-white text-xs">🌶️</span>
              ))}
            </div>
          </div>
        )}

        {/* Special Tags */}
        {menuItem.tags && menuItem.tags.length > 0 && (
          <div className="absolute bottom-20 left-4 flex flex-wrap gap-2">
            {menuItem.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}