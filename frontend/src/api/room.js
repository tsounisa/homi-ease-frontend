import axios from './axios';

export const getRooms = async (houseId) => {
  const response = await axios.get(`/houses/${houseId}/rooms`);
  return response.data.data; // Access the nested 'data' property
};

export const getRoom = async (roomId) => {
  const response = await axios.get(`/rooms/${roomId}`);
  return response.data.data; 
};

export const addRoom = async (houseId, roomData) => {
  const response = await axios.post(`/houses/${houseId}/rooms`, roomData);
  return response.data.data;
};

export const updateRoom = async (roomId, updates) => {
  const response = await axios.put(`/rooms/${roomId}`, updates);
  return response.data.data;
};

export const deleteRoom = async (roomId) => {
  const response = await axios.delete(`/rooms/${roomId}`);
  return response.data.data;
};