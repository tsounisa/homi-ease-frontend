import axios from './axios';

export const getHouses = async () => {
  const response = await axios.get('/houses');
  return response.data.data; // Access the nested 'data' property
};

export const getHouse = async (houseId) => {
  const response = await axios.get(`/houses/${houseId}`);
  return response.data.data; 
};

export const addHouse = async (houseData) => {
  const response = await axios.post('/houses', houseData);
  return response.data.data;
};

export const updateHouse = async (houseId, updates) => {
  const response = await axios.put(`/houses/${houseId}`, updates);
  return response.data.data;
};

export const deleteHouse = async (houseId) => {
  const response = await axios.delete(`/houses/${houseId}`);
  return response.data.data;
};