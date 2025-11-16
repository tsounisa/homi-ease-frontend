import axios from './axios';

export const login = async (credentials) => {
  const response = await axios.post('/auth/login', credentials);
  return response.data.data; // Access the nested 'data' property
};

export const register = async (userData) => {
  const { data } = await axios.post('/users/register', userData);
  return data;
};

export const getMe = async () => {
  const { data } = await axios.get('/users/me');
  return data;
};
