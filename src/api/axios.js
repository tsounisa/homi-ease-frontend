import axios from 'axios';

// Ensure this points to /api/v1
// Example: http://localhost:3000/api/v1
const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000/api/v1';

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => {
    // If backend returns { success: true, data: [...] }, return just the data
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    // Helper to extract the specific error message from our new ErrorHandler
    const message = error.response?.data?.message || 'Something went wrong';
    console.error(`API Error: ${message}`);
    return Promise.reject(new Error(message));
  }
);

export default instance;