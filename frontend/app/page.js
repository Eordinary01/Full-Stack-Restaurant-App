'use client'
import { useEffect, useState } from "react";
import { 
  Search, 
  Loader2, 
  Store, 
  TrendingUp, 
  Utensils, 
  X,
  ChevronDown,
  AlertCircle,
  Filter,
  SlidersHorizontal,
  MapPin,
  Star
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { get } from "@/utils/api";
import RestaurantCard from "@/components/RestaurantCard";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, loading, error, clearError, isLoggedIn } = useAuth();
  const [fetchingRestaurants, setFetchingRestaurants] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [sortOption, setSortOption] = useState("popular");
  const [filterCuisine, setFilterCuisine] = useState("all");
  
  const cuisineTypes = ["All", "Italian", "Mexican", "Japanese", "Indian", "American", "Chinese"];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setFetchError(null);
        const data = await get("/restaurants");
        setRestaurants(data);
        setFilteredRestaurants(data);
      } catch (error) {
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
    handleFilterAndSort();
  }, [searchQuery, sortOption, filterCuisine]);

  const handleFilterAndSort = () => {
    let results = [...restaurants];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(query) ||
          restaurant.description.toLowerCase().includes(query)
      );
    }
    
    if (filterCuisine && filterCuisine !== 'all') {
      results = results.filter(
        (restaurant) => restaurant.cuisine === filterCuisine
      );
    }
    
    if (sortOption === 'popular') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'newest') {
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    setFilteredRestaurants(results);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  if (loading || fetchingRestaurants) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center space-y-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-2xl opacity-20 animate-pulse" />
              <div className="relative p-6 bg-white rounded-2xl shadow-xl">
                <Utensils className="w-12 h-12 text-red-600 mb-2" />
                <Loader2 className="w-8 h-8 text-red-600 animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Discovering Amazing Restaurants</h2>
              <p className="text-gray-600 max-w-md">We're curating the perfect dining experiences just for you...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || fetchError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive" className="border-0 bg-white shadow-xl">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <AlertTitle className="text-lg font-semibold">Something went wrong</AlertTitle>
                </div>
              </div>
              <AlertDescription className="text-gray-600 mb-6">
                {error || fetchError}
              </AlertDescription>
              {error && (
                <Button 
                  onClick={clearError} 
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                >
                  Try Again
                </Button>
              )}
            </div>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section with Search */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-orange-500/10 to-yellow-500/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center space-y-8 mb-16">
            <div className="space-y-4">
              <Badge className="bg-white/80 backdrop-blur-sm text-red-600 border-red-200 shadow-sm px-4 py-2">
                <MapPin className="w-4 h-4 mr-2" />
                Discover Local Gems
              </Badge>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight">
                <span className="block text-gray-900 mb-2">Find Your</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500">
                  Perfect Meal
                </span>
              </h1>
              <p className="max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed font-medium">
                Discover extraordinary dining experiences, from hidden neighborhood treasures to celebrated culinary destinations
              </p>
            </div>
          </div>

          {/* Enhanced Search */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
              <div className="relative bg-white rounded-3xl shadow-2xl p-2">
                <div className="flex items-center">
                  <div className="flex-1 relative">
                    <Search className={`absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 transition-colors duration-200 ${
                      searchFocused ? 'text-red-500' : 'text-gray-400'
                    }`} />
                    <Input
                      type="text"
                      placeholder="Search for restaurants, cuisines, or dishes..."
                      value={searchQuery}
                      onChange={handleSearch}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                      className="w-full pl-16 pr-6 py-6 text-lg bg-transparent border-0 focus:ring-0 rounded-2xl placeholder-gray-500"
                    />
                  </div>
                  {searchQuery ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSearch}
                      className="mr-2 rounded-full h-10 w-10 p-0"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  ) : (
                    <Button className="mr-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 rounded-2xl px-8 py-6 text-white font-semibold shadow-lg">
                      Search
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Search Stats */}
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-8 bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-xl">
                    <Store className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{restaurants.length}</div>
                    <div className="text-sm text-gray-600">Restaurants</div>
                  </div>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-xl">
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">4.8</div>
                    <div className="text-sm text-gray-600">Avg Rating</div>
                  </div>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">24/7</div>
                    <div className="text-sm text-gray-600">Available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-900">Discover Restaurants</h2>
              <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200 px-3 py-1">
                {filteredRestaurants.length} found
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <Select value={filterCuisine} onValueChange={setFilterCuisine}>
                <SelectTrigger className="w-40 border-gray-200 rounded-xl">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Cuisines" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cuisines</SelectItem>
                  {cuisineTypes.slice(1).map((cuisine) => (
                    <SelectItem key={cuisine} value={cuisine.toLowerCase()}>
                      {cuisine}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-40 border-gray-200 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Restaurant Grid */}
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredRestaurants.map((restaurant, index) => (
              <div
                key={restaurant._id}
                className="opacity-0 animate-fade-in-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                <RestaurantCard restaurant={restaurant} />
              </div>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
            <CardContent className="flex flex-col items-center py-20 px-8">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gray-200 rounded-full blur-xl opacity-50" />
                <div className="relative p-8 bg-white rounded-2xl shadow-lg">
                  <Store className="w-16 h-16 text-gray-400" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">No restaurants found</h3>
              <p className="text-gray-600 text-center text-lg max-w-md mb-8">
                We couldn't find any restaurants matching your search. Try adjusting your filters or explore our featured restaurants.
              </p>
              <Button
                onClick={clearSearch}
                className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 rounded-xl px-8 py-3 text-white font-semibold shadow-lg"
              >
                Show All Restaurants
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Load More */}
        {filteredRestaurants.length > 6 && (
          <div className="flex justify-center mt-16">
            <Button 
              variant="outline" 
              className="group rounded-2xl px-8 py-4 text-lg font-semibold border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300"
            >
              <span>Load More Restaurants</span>
              <ChevronDown className="w-5 h-5 ml-2 text-gray-400 group-hover:animate-bounce" />
            </Button>
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
      `}</style>
    </div>
  );
}