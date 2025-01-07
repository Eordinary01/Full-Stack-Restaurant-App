"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Register() {
  const { register, error, loading, clearError } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    restaurantName: "",
    restaurantAddress: "",
    restaurantDescription: "",
    restaurantPhone: ""
  });

  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    clearError();
    setFormError("");
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name || !formData.email || !formData.password) {
      setFormError("All fields are required");
      return;
    }

    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }

    if (formData.role === "owner" && (
      !formData.restaurantName ||
      !formData.restaurantAddress ||
      !formData.restaurantDescription ||
      !formData.restaurantPhone
    )) {
      setFormError("Restaurant details are required for restaurant owners");
      return;
    }

    try {
      await register(formData);
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Create an Account
        </h1>

        {(error || formError) && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error || formError}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:ring focus:ring-red-200 focus:border-red-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:ring focus:ring-red-200 focus:border-red-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:ring focus:ring-red-200 focus:border-red-500"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-gray-700 font-semibold mb-2">
              Role
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:ring focus:ring-red-200 focus:border-red-500"
            >
              <option value="customer">Customer</option>
              <option value="owner">Restaurant Owner</option>
            </select>
          </div>

          {formData.role === "owner" && (
            <>
              <div>
                <label htmlFor="restaurantName" className="block text-gray-700 font-semibold mb-2">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  id="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:ring focus:ring-red-200 focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="restaurantAddress" className="block text-gray-700 font-semibold mb-2">
                  Restaurant Address
                </label>
                <input
                  type="text"
                  id="restaurantAddress"
                  value={formData.restaurantAddress}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:ring focus:ring-red-200 focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="restaurantDescription" className="block text-gray-700 font-semibold mb-2">
                  Restaurant Description
                </label>
                <input
                  type="text"
                  id="restaurantDescription"
                  value={formData.restaurantDescription}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:ring focus:ring-red-200 focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="restaurantPhone" className="block text-gray-700 font-semibold mb-2">
                  Restaurant Phone Number
                </label>
                <input
                  type="text"
                  id="restaurantPhone"
                  value={formData.restaurantPhone}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:ring focus:ring-red-200 focus:border-red-500"
                  required
                />
              </div>
            </>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-green-600 hover:text-green-800 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
