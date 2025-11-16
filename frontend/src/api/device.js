import axios from './axios';

export const getDevices = async (roomId) => {
  const response = await axios.get(`/rooms/${roomId}/devices`);
  return response.data.data; // Access the nested 'data' property
};

export const getAvailableDevices = async () => {
  const response = await axios.get('/devices/available');
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

export const controlDevice = async (deviceId, action) => {
  const response = await axios.post(`/devices/${deviceId}/action`, action); // Send action directly
  return response.data.data; // Access the nested 'data' property
};
