import axios from './axios'; // Uses your global unwrapper

export const login = async (credentials) => {
  // Axios interceptor unwraps to: { token, user }
  return await axios.post('/auth/login', credentials); 
};

export const register = async (userData) => {
  return await axios.post('/auth/register', userData);
};

export const getMe = async () => {
  // Axios interceptor unwraps to: { ...user... }
  return await axios.get('/auth/me'); 
};