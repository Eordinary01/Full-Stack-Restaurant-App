const API_BASE_URL = "http://127.0.0.1:8890/api";

const fetcher = async (url, options = {}) => {
  try {
    const token = 
      typeof window !== 'undefined' ? localStorage.getItem("token") : null;

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`; 
    }

    console.log( {
      url: API_BASE_URL + url,
      headers,
      ...options
    });

    const response = await fetch(API_BASE_URL + url, {
      ...options,
      headers,
    });

   
    const data = await response.json();
    // console.log('API Response:', data);

    
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

export const get = async (url, options = {}) => {
  try {
    return await fetcher(url, { ...options, method: "GET" });
  } catch (error) {
    console.error('GET Request Error:', error);
    throw error;
  }
};

export const post = async (url, data, options = {}) => {
  try {
    return await fetcher(url, { 
      ...options, 
      method: "POST", 
      body: JSON.stringify(data) 
    });
  } catch (error) {
    console.error('POST Request Error:', error);
    throw error;
  }
};

export const put = async (url, data, options = {}) => {
  try {
    return await fetcher(url, { 
      ...options, 
      method: "PUT", 
      body: JSON.stringify(data) 
    });
  } catch (error) {
    console.error('PUT Request Error:', error);
    throw error;
  }
};

export const del = async (url, options = {}) => {
  try {
    return await fetcher(url, { ...options, method: "DELETE" });
  } catch (error) {
    console.error('DELETE Request Error:', error);
    throw error;
  }
};