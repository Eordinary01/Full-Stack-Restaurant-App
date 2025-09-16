'use client'
import { useState } from 'react';
import Link from "next/link";
import { 
  Star, 
  MapPin, 
  Clock, 
  Heart, 
  ChefHat, 
  Share2, 
  Info,
  Copy,
  Twitter,
  X,
  Bookmark,
  Utensils,
  Phone,
  ExternalLink,
  Award,
  Users
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const RestaurantCard = ({ restaurant }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleShare = (type) => {
    if (type === 'copy') {
      navigator.clipboard.writeText(window.location.href);
    } else if (type === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=Check out ${restaurant.name}&url=${window.location.href}`);
    }
  };

  return (
    <Card className="group overflow-hidden h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white">
      {/* Enhanced Image Section */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-500/20 mix-blend-multiply z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <img
          src={restaurant?.image || "/api/placeholder/600/400"}
          alt={restaurant.name}
          onLoad={() => setIsImageLoaded(true)}
          className={`object-cover w-full h-full transition-all duration-700 ${
            isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
          } group-hover:scale-110`}
        />
        
        {/* Enhanced Action Buttons */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-xl bg-white/90 backdrop-blur-md shadow-lg h-10 w-10 border-0 hover:bg-white hover:scale-110 transition-all duration-300"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                >
                  <Bookmark 
                    className={`w-4 h-4 transition-all duration-300 ${
                      isBookmarked ? 'fill-amber-500 text-amber-500 scale-110' : 'text-gray-600'
                    }`} 
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{isBookmarked ? 'Remove from favorites' : 'Add to favorites'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-xl bg-white/90 backdrop-blur-md shadow-lg h-10 w-10 border-0 hover:bg-white hover:scale-110 transition-all duration-300"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart 
                    className={`w-4 h-4 transition-all duration-300 ${
                      isLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-600'
                    }`} 
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{isLiked ? 'Remove like' : 'Like restaurant'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-xl bg-white/90 backdrop-blur-md shadow-lg h-10 w-10 border-0 hover:bg-white hover:scale-110 transition-all duration-300"
              >
                <Share2 className="w-4 h-4 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleShare('copy')}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('twitter')}>
                <Twitter className="w-4 h-4 mr-2" />
                Share on Twitter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Enhanced Status Indicators */}
        <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-2">
          {restaurant.isOpen && (
            <Badge className="bg-black/40 backdrop-blur-md text-white border-none rounded-xl px-3 py-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
              Open Now
            </Badge>
          )}
          {restaurant.featured && (
            <Badge className="bg-gradient-to-r from-yellow-500/90 to-orange-500/90 backdrop-blur-md text-white border-none rounded-xl px-3 py-1">
              <Award className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-white/90 backdrop-blur-md rounded-xl px-3 py-2 shadow-lg">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-bold text-gray-900">
                {restaurant.rating || "4.5"}
              </span>
              <span className="text-xs text-gray-600">
                ({restaurant.reviewCount || "128"})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Card Content */}
      <div className="p-6">
        <CardHeader className="p-0 mb-4">
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-xl font-bold line-clamp-1 group-hover:text-red-600 transition-colors duration-300">
              {restaurant.name}
            </CardTitle>
          </div>
          
          <div className="flex items-center justify-between">
            <CardDescription className="flex items-center text-sm">
              <ChefHat className="w-4 h-4 mr-2 text-red-500" />
              <span className="font-medium">{restaurant.cuisine || "Various Cuisines"}</span>
            </CardDescription>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
              $$-$$$
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 space-y-4">
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {restaurant.description || "Experience exceptional dining with carefully crafted dishes using the finest local ingredients."}
          </p>
          
          {/* Enhanced Info Grid */}
          <div className="grid grid-cols-1 gap-3">
            {restaurant.address && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <MapPin className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-sm text-gray-700 font-medium line-clamp-1">{restaurant.address}</span>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-600">25-35 min</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-600">Busy</span>
              </div>
            </div>
          </div>

          {/* Enhanced Features */}
          {restaurant.features && restaurant.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {restaurant.features.slice(0, 3).map((feature, index) => (
                <Badge 
                  key={index}
                  variant="outline"
                  className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-200 hover:from-blue-100 hover:to-purple-100 transition-all duration-200 px-2 py-1"
                >
                  {feature}
                </Badge>
              ))}
              {restaurant.features.length > 3 && (
                <Badge 
                  variant="outline"
                  className="text-xs bg-gray-100 text-gray-600 border-gray-300"
                >
                  +{restaurant.features.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </div>

      {/* Enhanced Footer */}
      <CardFooter className="p-6 pt-0 flex gap-3">
        <Button 
          asChild
          className="flex-1 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl font-semibold group"
        >
          <Link href={`/restaurants/${restaurant._id}`}>
            <Utensils className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
            View Menu
          </Link>
        </Button>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="rounded-xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300 px-4">
              <Info className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{restaurant.name}</DialogTitle>
              <DialogDescription>
                Complete restaurant information and details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-gray-900 uppercase tracking-wide">Hours</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {restaurant.hours || "Monday - Sunday: 11:00 AM - 10:00 PM"}
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-gray-900 uppercase tracking-wide">Features</h4>
                <div className="flex flex-wrap gap-2">
                  {(restaurant.features || ["Outdoor Seating", "Delivery", "Takeout", "Wheelchair Accessible"]).map((feature, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{feature}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-gray-900 uppercase tracking-wide">Contact</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{restaurant.phone || "(555) 123-4567"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{restaurant.website || "www.restaurant.com"}</span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default RestaurantCard;