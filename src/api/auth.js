import axios from './axios';

export const login = async (credentials) => {
  // Returns: { success: true, message: "...", data: { token, user } }
  return await axios.post('/auth/login', credentials); 
};

export const register = async (userData) => {
  // Swagger Note: Register returns the 'User' object directly, NOT wrapped in 'data'
  // Returns: { _id: "...", name: "...", ... }
  return await axios.post('/auth/register', userData);
};

export const getMe = async () => {
  // Returns: { success: true, data: { _id: "...", name: "..." } }
  return await axios.get('/auth/me'); 
};