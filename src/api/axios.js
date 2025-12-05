import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api/v1';

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attaches Token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Matches 'bearerAuth' in Swagger
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- NEW RESPONSE INTERCEPTOR ---
instance.interceptors.response.use(
  (response) => {
    // Automatically unwrap the Axios HTTP wrapper
    // Returns the actual API payload (e.g., { success: true, data: ... })
    return response.data;
  },
  (error) => {
    // Optional: Global error handling (e.g., redirect on 401)
    if (error.response && error.response.status === 401) {
      // Logic to clear local storage or redirect to login could go here
    }
    return Promise.reject(error);
  }
);

export default instance;