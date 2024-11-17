import { useState } from 'react';
import Link from "next/link";
import { Star, MapPin, Clock, Heart, ChefHat, Share2, Info } from "lucide-react";
import { Transition, Popover } from '@headlessui/react';
import { Fragment } from 'react';

const RestaurantCard = ({ restaurant }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 ease-in-out transform hover:-translate-y-1 relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Quick Actions Menu */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {/* Share Button Popover */}
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 hover:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                <Share2 className="w-5 h-5 text-gray-600" />
              </Popover.Button>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute right-0 z-10 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="p-2 space-y-1">
                    <button className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-red-50 rounded-md flex items-center gap-2">
                      <span>Copy Link</span>
                    </button>
                    <button className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-red-50 rounded-md flex items-center gap-2">
                      <span>Share on Twitter</span>
                    </button>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>

        {/* Favorite Button */}
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 hover:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <Heart 
            className={`w-5 h-5 transition-colors duration-300 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
          />
        </button>
      </div>

      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
        <img
          src={restaurant?.image || "data:image/png;base64,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"}
          alt={restaurant.name}
          className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Status Badge */}
        {restaurant.isOpen && (
          <div className="absolute bottom-4 left-4 z-20 flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">
              Open Now
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-red-600 transition-colors duration-300">
              {restaurant.name}
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="ml-1 text-sm font-semibold text-gray-700">
                  {restaurant.rating || "4.5"}
                </span>
              </div>
              <span className="text-gray-400">•</span>
              <div className="flex items-center gap-1">
                <ChefHat className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{restaurant.cuisine}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
          {restaurant.description}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {restaurant.address && (
            <div className="flex items-center gap-2 group/item">
              <div className="p-2 bg-gray-50 rounded-lg group-hover/item:bg-red-50 transition-colors duration-300">
                <MapPin className="w-4 h-4 text-gray-400 group-hover/item:text-red-500 transition-colors duration-300" />
              </div>
              <span className="text-sm text-gray-600 line-clamp-1">{restaurant.address}</span>
            </div>
          )}
          {restaurant.phone && (
            <div className="flex items-center gap-2 group/item">
              <div className="p-2 bg-gray-50 rounded-lg group-hover/item:bg-red-50 transition-colors duration-300">
                <Clock className="w-4 h-4 text-gray-400 group-hover/item:text-red-500 transition-colors duration-300" />
              </div>
              <span className="text-sm text-gray-600">{restaurant.phone}</span>
            </div>
          )}
        </div>

        {/* Features/Amenities */}
        <div className="flex flex-wrap gap-2 mb-6">
          {restaurant.features?.map((feature, index) => (
            <span 
              key={index}
              className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-full ring-1 ring-gray-200"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link 
            href={`/restaurants/${restaurant._id}`}
            className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-300 font-medium text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            View Details
          </Link>
          
          <Popover className="relative">
            {({ open }) => (
              <>
                <Popover.Button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                  <Info className="w-5 h-5 text-gray-600" />
                </Popover.Button>

                <Transition
                  show={open}
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute bottom-full right-0 mb-2 w-64 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-4">
                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-900">Quick Info</h3>
                      <p className="text-sm text-gray-600">
                        {restaurant.quickInfo || "Get more details about opening hours, special requirements, and facilities."}
                      </p>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;