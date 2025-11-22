import axios from './axios';

export const getDevices = async (roomId) => {
  const response = await axios.get(`/rooms/${roomId}/devices`);
  return response.data.data; 
};

export const getDevice = async (deviceId) => {
  const response = await axios.get(`/devices/${deviceId}`);
  return response.data.data;
};

export const addDevice = async (roomId, deviceData) => {
  const response = await axios.post(`/rooms/${roomId}/devices`, deviceData);
  return response.data.data;
};

export const deleteDevice = async (deviceId) => {
  const response = await axios.delete(`/devices/${deviceId}`);
  return response.data.data;
};

export const updateDevice = async (deviceId, updates) => {
  // updates example: { status: "ON" } ή { name: "New Name" }
  const response = await axios.put(`/devices/${deviceId}`, updates); 
  return response.data.data; 
};