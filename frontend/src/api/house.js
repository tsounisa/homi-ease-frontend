import axios from './axios';

export const addHouse = async (houseData) => {
  const response = await axios.post('/houses', houseData);
  return response.data.data;
};

export const getHouses = async () => {
  const response = await axios.get('/houses');
  return response.data.data; // Access the nested 'data' property
};

export const getHouse = async (houseId) => {
  const { data } = await axios.get(`/houses/${houseId}`);
  return data;
};
