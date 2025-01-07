const API_BASE_URL = "http://127.0.0.1:8890/api";

// Fetcher function for common API requests
const fetcher = async (url, options = {}) => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Log only for debugging in development (ensure to mute/remove for production)
    if (process.env.NODE_ENV === 'development') {
      console.log({
        url: API_BASE_URL + url,
        headers,
        ...options
      });
    }

    const response = await fetch(API_BASE_URL + url, { ...options, headers });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 && data.message?.includes("Token expired")) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      }
      throw new Error(data.message || "API request failed");
    }

    return data;

  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// POST request
export const post = async (url, data, options = {}) => {
  try {
    return await fetcher(url, { 
      ...options, 
      method: "POST", 
      body: data ? JSON.stringify(data) : undefined // Avoid sending body if data is undefined or null
    });
  } catch (error) {
    console.error('POST Request Error:', error);
    throw error;
  }
};

// GET request
export const get = async (url, options = {}) => {
  try {
    return await fetcher(url, { ...options, method: "GET" });
  } catch (error) {
    console.error('GET Request Error:', error);
    throw error;
  }
};

// PUT request
export const put = async (url, data, options = {}) => {
  try {
    return await fetcher(url, { 
      ...options, 
      method: "PUT", 
      body: data ? JSON.stringify(data) : undefined // Avoid sending body if data is undefined or null
    });
  } catch (error) {
    console.error('PUT Request Error:', error);
    throw error;
  }
};

// PATCH request
export const patch = async (url, data, options = {}) => {
  try {
    return await fetcher(url, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined // Avoid sending body if data is undefined or null
    });
  } catch (error) {
    console.error('PATCH Request Error:', error);
    throw error;
  }
};

// DELETE request
export const del = async (url, options = {}) => {
  try {
    return await fetcher(url, { ...options, method: "DELETE" });
  } catch (error) {
    console.error('DELETE Request Error:', error);
    throw error;
  }
};
