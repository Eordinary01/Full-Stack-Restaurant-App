'use client';

import { useState } from 'react';
import { post } from '@/utils/api';
import { AlertCircle, CheckCircle2, X, ShoppingBag, ChevronRight } from 'lucide-react';

const OrderModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative w-full max-w-7xl bg-white rounded-xl shadow-2xl">
          <button onClick={onClose} className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

const OrderForm = ({ menuItems, restaurantId, onClose }) => {
  const [orderItems, setOrderItems] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    paymentMethod: 'Credit Card',
    specialInstructions: '',
    deliveryAddress: '',
    contactNumber: ''
  });

  const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleAddItem = (menuItem) => {
    const existingItem = orderItems.find(item => item.menuItem === menuItem._id);
    if (existingItem) {
      setOrderItems(orderItems.map(item => 
        item.menuItem === menuItem._id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setOrderItems([...orderItems, {
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1
      }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await post('/orders/create-order', { restaurant: restaurantId, orderItems, ...formData });
      setSuccess('Order placed successfully!');
      setTimeout(onClose, 2000);
    } catch (err) {
      setError(err.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[80vh]">
      {/* Menu Items Section */}
      <div className="w-1/3 p-6 border-r border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Menu</h2>
          <ShoppingBag className="w-6 h-6 text-gray-500" />
        </div>
        <div className="space-y-4 h-[calc(100%-4rem)] overflow-y-auto">
          {menuItems.map((item) => (
            <div
              key={item._id}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors cursor-pointer"
              onClick={() => handleAddItem(item)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{item.name}</h3>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mt-1">${item.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details Section */}
      <div className="w-1/3 p-6 border-r border-gray-200 bg-gray-50">
        <h2 className="text-2xl font-semibold mb-6">Your Order</h2>
        <div className="space-y-4 h-[calc(100%-12rem)] overflow-y-auto">
          {orderItems.map((item, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{item.name}</h3>
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => {
                    const newItems = [...orderItems];
                    newItems[index].quantity = parseInt(e.target.value);
                    setOrderItems(newItems);
                  }}
                  className="w-20 p-2 border rounded bg-white"
                />
                <button
                  onClick={() => setOrderItems(orderItems.filter((_, i) => i !== index))}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Checkout Form Section */}
      <div className="w-1/3 p-6">
        <h2 className="text-2xl font-semibold mb-6">Checkout</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={formData.paymentMethod}
            onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Cash">Cash</option>
          </select>

          <input
            type="text"
            placeholder="Delivery Address"
            value={formData.deliveryAddress}
            onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          <input
            type="tel"
            placeholder="Contact Number"
            value={formData.contactNumber}
            onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          <textarea
            placeholder="Special Instructions"
            value={formData.specialInstructions}
            onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none"
          />

          {error && (
            <div className="flex items-center p-4 bg-red-50 text-red-700 rounded-lg">
              <AlertCircle className="w-5 h-5 mr-2" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center p-4 bg-green-50 text-green-700 rounded-lg">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              <p>{success}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || orderItems.length === 0}
            className="w-full py-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Placing Order...' : `Place Order • $${totalAmount.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export { OrderForm, OrderModal };