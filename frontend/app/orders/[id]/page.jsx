'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { get } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';

const OrderDetails = ({ params }) => {
  const { id } = params;
  const { user, isLoggedIn } = useAuth();
  const [order, setOrder] = useState(null);
  const [orderStats, setOrderStats] = useState({});
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchOrder = async (orderId) => {
    try {
      const data = await get(`/orders/${orderId}`);
      setOrder(data.order);
      setOrderStats({
        pending: data.order.status === 'Pending' ? 1 : 0,
        processing: ['Confirmed', 'Preparing', 'Ready', 'Out for Delivery'].includes(
          data.order.status
        ) ? 1 : 0,
        completed: data.order.status === 'Delivered' ? 1 : 0,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    fetchOrder(id);
  }, [id, isLoggedIn]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Order</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto animate-pulse">
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
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 p-6">
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
            <p className="mt-1 text-sm text-gray-500">Order placed on {new Date().toLocaleDateString()}</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Always show Order ID and Status */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Order ID</h3>
                <p className="text-gray-900 font-medium">{order._id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                  ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'}`}>
                  {order.status}
                </span>
              </div>
              {/* Conditionally render Address for Owner */}
              {user.role === 'owner' && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Address</h3>
                  <p className="text-gray-900">{order.deliveryAddress || 'N/A'}</p>
                </div>
              )}
            </div>

            {/* Conditionally render Restaurant Info for Owner */}
            {user.role === 'owner' && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Restaurant</h3>
                <p className="text-gray-900">{order.restaurant?.name || 'N/A'}</p>
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                {order.orderItems?.map((item, index) => (
                  <div key={index} className={`flex items-center justify-between p-4
                    ${index !== order.orderItems.length - 1 ? 'border-b border-gray-200' : ''}`}>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div>
                        <p className="font-medium text-gray-900">{item.menuItem?.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium text-gray-900">${(item.menuItem?.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Conditionally render Order Progress for Owner */}
            {user.role === 'owner' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Progress</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white border border-yellow-200 rounded-lg p-4 text-center">
                    <div className="text-yellow-600 font-semibold mb-1">Pending</div>
                    <div className="text-2xl font-bold text-yellow-700">{orderStats.pending}</div>
                  </div>
                  <div className="bg-white border border-blue-200 rounded-lg p-4 text-center">
                    <div className="text-blue-600 font-semibold mb-1">Processing</div>
                    <div className="text-2xl font-bold text-blue-700">{orderStats.processing}</div>
                  </div>
                  <div className="bg-white border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-green-600 font-semibold mb-1">Completed</div>
                    <div className="text-2xl font-bold text-green-700">{orderStats.completed}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
