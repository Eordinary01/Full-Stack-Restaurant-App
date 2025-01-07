'use client';

import React, { useEffect, useState } from 'react';
import { get } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('Auth Status:', { isLoggedIn, user });

    if (!isLoggedIn) {
      console.log('User not logged in, redirecting to login page');
      router.push('/login');
      return;
    }

    if (!user || !user.restaurant && user.role === 'owner') {
      console.log('No restaurant associated with this user:', user);
      setError('No restaurant linked to your account.');
      setLoading(false);
      return;
    }

    async function fetchOrders() {
      try {
        console.log('Fetching orders for user:', user);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token missing. Please log in again.');
          return;
        }

        // Fetch orders depending on the role
        let data;
        if (user.role === 'owner') {
          // Owner fetches all orders related to their restaurant
          data = await get(`/orders?restaurantId=${user.restaurant.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else if (user.role === 'customer') {
          // Customer fetches their specific orders
          data = await get(`/orders/customer-orders`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        console.log('Orders fetched successfully:', data);
        setOrders(data.orders || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Failed to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [isLoggedIn, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {user.role === 'owner' ? 'Restaurant Orders' : 'Your Orders'}
        </h1>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-gray-600">
              {user.role === 'owner'
                ? 'No orders available for your restaurant.'
                : 'You have no orders yet.'}
            </p>
          ) : (
            orders.map((order) => (
              <Link
                key={order._id}
                href={`/orders/${order._id}`}
                className="block bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-200 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-semibold text-gray-900">
                        Order #{order._id}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <span className="text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
                      View Details →
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    {user.role === 'owner' ? (
                      <span>{user.restaurant.name}</span>
                    ) : (
                      <span>{`Restaurant: ${order.restaurant.name}`}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
