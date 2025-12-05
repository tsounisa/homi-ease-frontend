import axios from './axios';

// Get all automations
export const getAutomations = async () => {
  // Axios interceptor returns the array directly
  return await axios.get('/automations');
};

// Create a new automation
export const createAutomation = async (automationData) => {
  // REMOVED destructuring: const { data } = ...
  // The interceptor in axios.js already returns the payload.
  return await axios.post('/automations', automationData);
};

// Get specific automation
export const getAutomation = async (automationId) => {
  return await axios.get(`/automations/${automationId}`);
};

// Update automation
export const updateAutomation = async (automationId, updates) => {
  return await axios.put(`/automations/${automationId}`, updates);
};

// Delete automation
export const deleteAutomation = async (automationId) => {
  return await axios.delete(`/automations/${automationId}`);
};