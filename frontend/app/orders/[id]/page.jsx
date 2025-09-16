'use client';

import React, { useEffect, useState,use } from 'react';
import { useRouter } from 'next/navigation';
import { get, put,patch } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Package, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Store, 
  Truck, 
  CheckCircle,
  AlertCircle,
  ClipboardList,
  User,
  X
} from 'lucide-react';

const OrderDetails = ({ params }) => {
  const resolvedParams = use(params);
    const id = resolvedParams.id;
  const { user, isLoggedIn } = useAuth();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('items');
  const router = useRouter();

  const orderStatuses = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered'];

  const fetchOrder = async (orderId) => {
    try {
      const data = await get(`/orders/${orderId}`);
      setOrder(data.order);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    setUpdateLoading(true);
    try {
      await patch(`/orders/${id}/status`, { status: newStatus });
      await fetchOrder(id);
      setUpdateMessage('Order status updated successfully');
      setTimeout(() => setUpdateMessage(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!order?.orderItems) return 0;
    return order.orderItems.reduce((total, item) => {
      return total + (item.menuItem?.price || 0) * item.quantity;
    }, 0);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    fetchOrder(id);
  }, [id, isLoggedIn]);

  const getStatusColor = (status) => {
    const statusColors = {
      'Pending': 'bg-yellow-500',
      'Confirmed': 'bg-blue-500',
      'Preparing': 'bg-purple-500',
      'Ready': 'bg-indigo-500',
      'Out for Delivery': 'bg-orange-500',
      'Delivered': 'bg-green-500'
    };
    return statusColors[status] || 'bg-gray-500';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending': return <Clock className="w-5 h-5" />;
      case 'Confirmed': return <ClipboardList className="w-5 h-5" />;
      case 'Preparing': return <Package className="w-5 h-5" />;
      case 'Ready': return <CheckCircle className="w-5 h-5" />;
      case 'Out for Delivery': return <Truck className="w-5 h-5" />;
      case 'Delivered': return <CheckCircle className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  // JSX for the owner's order management interface
  const OwnerControls = () => (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Update Order Status</h3>
        
        {updateMessage && (
          <div className="mb-4 flex items-center justify-between bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
            <span>{updateMessage}</span>
            <button onClick={() => setUpdateMessage(null)} className="text-green-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        <div className="space-y-4">
          {orderStatuses.map((status) => {
            const isCurrentStatus = order.status === status;
            const canTransition = orderStatuses.indexOf(status) === orderStatuses.indexOf(order.status) + 1;
            
            return (
              <div key={status} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                    isCurrentStatus ? getStatusColor(status) : 'bg-gray-200'
                  }`}>
                    {getStatusIcon(status)}
                  </div>
                  <span className="font-medium text-gray-900">{status}</span>
                </div>
                
                <button
                  onClick={() => updateOrderStatus(status)}
                  disabled={!canTransition || updateLoading}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isCurrentStatus 
                      ? 'bg-green-500 text-white cursor-default'
                      : canTransition
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isCurrentStatus ? 'Current Status' : canTransition ? 'Update to This Status' : 'Not Available'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Notes</h3>
        <textarea 
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          placeholder="Add notes about this order..."
          rows={4}
        />
        <button className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
          Save Notes
        </button>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Order</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Order Header Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
            <h1 className="text-2xl font-bold text-white">Order #{order._id.slice(-6)}</h1>
            <p className="mt-1 text-blue-100">
              Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>

          {/* Status Timeline */}
          <div className="p-6 border-b">
            <div className="relative">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200"></div>
              <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 h-1 transition-all duration-500 ${getStatusColor(order.status)}`} 
                   style={{ width: `${orderStatuses.indexOf(order.status) * 20}%` }}></div>
              <div className="relative flex justify-between">
                {orderStatuses.map((status, index) => (
                  <div key={status} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white mb-2 
                      ${order.status === status ? getStatusColor(status) : 'bg-gray-200'}`}>
                      {getStatusIcon(status)}
                    </div>
                    <span className="text-xs text-gray-600">{status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 p-6">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Total Amount</div>
              <div className="text-2xl font-bold text-gray-900">${calculateTotal().toFixed(2)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Items</div>
              <div className="text-2xl font-bold text-gray-900">{order.orderItems?.length || 0}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Estimated Time</div>
              <div className="text-2xl font-bold text-gray-900">30 min</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="flex border-b">
            <button 
              onClick={() => setActiveTab('items')}
              className={`flex-1 px-6 py-4 text-sm font-medium ${
                activeTab === 'items' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}>
              Order Items
            </button>
            <button 
              onClick={() => setActiveTab('details')}
              className={`flex-1 px-6 py-4 text-sm font-medium ${
                activeTab === 'details' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}>
              Details
            </button>
            {user.role === 'owner' && (
              <button 
                onClick={() => setActiveTab('manage')}
                className={`flex-1 px-6 py-4 text-sm font-medium ${
                  activeTab === 'manage' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}>
                Manage Order
              </button>
            )}
          </div>

          <div>
            {activeTab === 'items' && (
              <div className="p-6 space-y-4">
                {order.orderItems?.map((item, index) => (
                  <div key={index} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-white rounded-lg shadow-sm flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.menuItem?.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-gray-900">
                        ${(item.menuItem?.price * item.quantity).toFixed(2)}
                      </span>
                      <p className="text-sm text-gray-500">
                        ${item.menuItem?.price} each
                      </p>
                    </div>
                  </div>
                ))}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Order Total</span>
                    <span className="font-bold text-blue-600 text-xl">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Delivery Address</h3>
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <p className="text-gray-900">{order.deliveryAddress || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Restaurant</h3>
                    <div className="flex items-start space-x-3">
                      <Store className="w-5 h-5 text-gray-400 mt-0.5" />
                      <p className="text-gray-900">{order.restaurant?.name || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Customer</h3>
                    <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                      <p className="text-gray-900">{order.restaurant?._id || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                {/* Additional customer details */}
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{order.restaurant?.phone || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{order.email || '69@gmail.com'}</p>
                    </div>
                  </div>
                </div>
                {/* Special Instructions */}
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Special Instructions</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900">{order.specialInstructions || 'No special instructions'}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'manage' && user.role === 'owner' && <OwnerControls />}
          </div>
        </div>
        
        {/* Action Buttons */}
        {user.role === 'owner' && (
          <div className="flex gap-4 justify-end">
            <button 
              onClick={() => router.push('/orders')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back to Orders
            </button>
            <button 
              onClick={() => {/* Add print functionality */}}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Print Order
            </button>
          </div>
        )}

        {/* Cancel Order Modal - Only show for pending orders */}
        {order.status === 'Pending' && user.role === 'owner' && (
          <div className="mt-6">
            <button 
              onClick={() => {/* Add cancel order functionality */}}
              className="w-full px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
              <AlertCircle className="w-5 h-5" />
              Cancel Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;