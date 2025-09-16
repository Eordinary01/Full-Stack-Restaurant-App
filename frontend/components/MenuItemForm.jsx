import React, { useState } from 'react';
import { X, DollarSign, ImageIcon, Loader2, Upload, Camera, Sparkles, Tag, FileText } from 'lucide-react';

const MenuItemForm = ({ 
  showMenuItemForm, 
  setShowMenuItemForm, 
  menuItemForm, 
  setMenuItemForm, 
  handleCreateMenuItem,
  MENU_CATEGORIES 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  if (!showMenuItemForm) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMenuItemForm({ ...menuItemForm, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setMenuItemForm({ ...menuItemForm, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await handleCreateMenuItem(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-6xl mx-4 shadow-2xl transform transition-all max-h-[90vh] overflow-hidden">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-br from-red-500 via-orange-500 to-pink-600 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          
          <div className="relative flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Create Menu Item</h2>
                <p className="text-white/90">Add a delicious new item to your menu</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowMenuItemForm(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-3 rounded-2xl transition-all duration-300 backdrop-blur-sm"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Enhanced Form Content */}
        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-12 gap-8">
            {/* Left Column - Enhanced Image Upload */}
            <div className="col-span-5 space-y-6">
              <div className="relative">
                <label 
                  className={`flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 overflow-hidden ${
                    dragActive 
                      ? 'border-red-500 bg-red-50 scale-105' 
                      : 'border-gray-200 bg-gradient-to-br from-gray-50 to-white hover:border-red-300 hover:bg-red-50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {previewImage ? (
                    <div className="absolute inset-0 group">
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="text-center text-white">
                          <Camera className="w-8 h-8 mx-auto mb-2" />
                          <p className="font-semibold">Change Image</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 px-6 text-center">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-xl opacity-20" />
                        <div className="relative p-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-lg">
                          <Upload className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-semibold text-gray-700">
                          <span className="text-red-600">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
                        <p className="text-xs text-gray-400">Recommended: 800x600px for best quality</p>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {/* Enhanced Tips Section */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-orange-100 rounded-xl">
                    <Camera className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="font-bold text-orange-800">Photography Tips</h3>
                </div>
                <ul className="space-y-2 text-sm text-orange-700">
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Use natural lighting for vibrant colors</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Show the entire dish in frame</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Square images work best (1:1 ratio)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Keep backgrounds simple and clean</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column - Enhanced Form Fields */}
            <div className="col-span-7 space-y-6">
              {/* Item Name */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <Tag className="w-4 h-4 text-red-500" />
                  <span>Item Name</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Truffle Mushroom Risotto"
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                  value={menuItemForm.name}
                  onChange={(e) => setMenuItemForm({ ...menuItemForm, name: e.target.value })}
                />
              </div>

              {/* Category & Price Row */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span>Category</span>
                  </label>
                  <select
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-300 shadow-sm hover:shadow-md"
                    value={menuItemForm.category}
                    onChange={(e) => setMenuItemForm({ ...menuItemForm, category: e.target.value })}
                  >
                    {MENU_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span>Price</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                      value={menuItemForm.price}
                      onChange={(e) => setMenuItemForm({ ...menuItemForm, price: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <FileText className="w-4 h-4 text-purple-500" />
                  <span>Description</span>
                </label>
                <textarea
                  placeholder="Describe your dish in detail - ingredients, preparation style, taste profile..."
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md resize-none"
                  value={menuItemForm.description}
                  onChange={(e) => setMenuItemForm({ ...menuItemForm, description: e.target.value })}
                  rows={5}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {menuItemForm.description.length}/500 characters
                </p>
              </div>

              {/* Additional Options */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  <span>Additional Options</span>
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-red-500 focus:ring-red-500" />
                    <span className="text-sm text-gray-700">🌶️ Spicy</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-green-500 focus:ring-green-500" />
                    <span className="text-sm text-gray-700">🌱 Vegan</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-purple-500 focus:ring-purple-500" />
                    <span className="text-sm text-gray-700">⭐ Popular</span>
                  </label>
                </div>
              </div>

              {/* Enhanced Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowMenuItemForm(false)}
                  className="px-8 py-3 text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 text-white bg-gradient-to-r from-red-500 via-orange-500 to-pink-600 rounded-2xl hover:from-red-600 hover:via-orange-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center font-semibold shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Item...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Create Menu Item
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuItemForm;