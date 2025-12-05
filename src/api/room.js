import axios from './axios';

export const getRooms = async (houseId) => {
  // axios.js interceptor returns the array of rooms directly
  return await axios.get(`/houses/${houseId}/rooms`);
};

export const getRoom = async (roomId) => {
  return await axios.get(`/rooms/${roomId}`);
};

export const addRoom = async (houseId, roomData) => {
  return await axios.post(`/houses/${houseId}/rooms`, roomData);
};

export const updateRoom = async (roomId, updates) => {
  return await axios.put(`/rooms/${roomId}`, updates);
};

export const deleteRoom = async (roomId) => {
  return await axios.delete(`/rooms/${roomId}`);
};