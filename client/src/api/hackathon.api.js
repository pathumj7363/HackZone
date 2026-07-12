import api from './axios';

export const getHackathonsApi = async () => {
  const response = await api.get('/hackathons');
  return response.data;
};

export const getHackathonDetailApi = async (id) => {
  const response = await api.get(`/hackathons/${id}`);
  return response.data;
};

export const createHackathonApi = async (data) => {
  const response = await api.post('/hackathons', data);
  return response.data;
};

export const registerHackathonApi = async (data) => {
  const response = await api.post('/hackathons/register', data);
  return response.data;
};
