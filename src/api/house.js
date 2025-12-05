import axios from './axios';

export const getHouses = async () => {
  return await axios.get('/houses'); 
};

export const getHouse = async (houseId) => {
  return await axios.get(`/houses/${houseId}`);
};

export const addHouse = async (houseData) => {
  return await axios.post('/houses', houseData);
};

export const updateHouse = async (houseId, updates) => {
  return await axios.put(`/houses/${houseId}`, updates);
};

export const deleteHouse = async (houseId) => {
  return await axios.delete(`/houses/${houseId}`);
};