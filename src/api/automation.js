import axios from './axios';

export const createAutomation = async (automationData) => {
  const { data } = await axios.post('/automations', automationData);
  return data;
};
