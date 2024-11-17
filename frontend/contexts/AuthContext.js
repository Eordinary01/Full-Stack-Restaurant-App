"use client";

import { get, post } from "@/utils/api";
import { useRouter } from "next/navigation";
import { createContext, useState, useEffect, useContext } from "react";
import jwt from "jsonwebtoken";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();

  // Function to check if the token is expired
  const checkTokenExpiration = (token) => {
    if (!token) return false;
    try {
      const decodedToken = jwt.decode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken && decodedToken.exp > currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  };

  // Validate token and set user on initial load
  const handleTokenValidation = () => {
    const storedToken = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedToken && checkTokenExpiration(storedToken)) {
      setToken(storedToken);
      setUser(storedUser);
      setIsLoggedIn(true);
    } else {
      logout(); // If token is expired or missing, log out
    }
    setLoading(false);
  };

  useEffect(() => {
    handleTokenValidation();
  }, []);

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const data = await post("/auth/register", userData);
      const newToken = data.token;

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(newToken);
      setUser(data.user);
      setIsLoggedIn(true);
      router.push("/login");
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);

      const data = await post("/auth/login", credentials);
      const newToken = data.token;

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(newToken);
      setUser(data.user);
      setIsLoggedIn(true);
      router.push("/");
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);

    if (router.pathname !== "/login") {
      router.push("/login");
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    isLoggedIn,
    register,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
