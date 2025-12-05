import axios from './axios';

export const getDevices = async (roomId) => {
  return await axios.get(`/rooms/${roomId}/devices`); 
};

export const getDevice = async (deviceId) => {
  return await axios.get(`/devices/${deviceId}`);
};

export const addDevice = async (roomId, deviceData) => {
  return await axios.post(`/rooms/${roomId}/devices`, deviceData);
};

export const deleteDevice = async (deviceId) => {
  return await axios.delete(`/devices/${deviceId}`);
};

export const updateDevice = async (deviceId, updates) => {
  return await axios.put(`/devices/${deviceId}`, updates); 
};