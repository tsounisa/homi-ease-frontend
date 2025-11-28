import axios from './axios';

export const login = async (credentials) => {
  const response = await axios.post('/auth/login', credentials);
  // Επιστρέφουμε το response.data.data επειδή το backend στέλνει { success: true, data: {...} }
  return response.data.data || response.data; 
};

export const register = async (userData) => {
  const { data } = await axios.post('/auth/register', userData);
  return data;
};

export const getMe = async () => {
  const { data } = await axios.get('/users/me');
  return data;
};