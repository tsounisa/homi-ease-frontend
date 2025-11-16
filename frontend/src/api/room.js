import axios from './axios';

export const addRoom = async (houseId, roomData) => {
  const response = await axios.post(`/houses/${houseId}/rooms`, roomData);
  return response.data.data;
};

export const getRooms = async (houseId) => {
  const response = await axios.get(`/houses/${houseId}/rooms`);
  return response.data.data; // Access the nested 'data' property
};

export const getRoom = async (roomId) => {
  const { data } = await axios.get(`/rooms/${roomId}`);
  return data;
};
