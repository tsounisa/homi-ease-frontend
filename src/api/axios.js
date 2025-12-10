import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api/v1', // Adjust this to your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token to headers
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
