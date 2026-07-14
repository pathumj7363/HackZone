import api from './axios';

export const getHackathonsApi = async () => {
  const response = await api.get('/hackathons');
  // Server wraps responses in { data: ... } — unwrap to get the plain array
  return response.data?.data ?? response.data;
};

export const getHackathonDetailApi = async (id) => {
  const response = await api.get(`/hackathons/${id}`);
  return response.data?.data ?? response.data;
};

export const createHackathonApi = async (data) => {
  const response = await api.post('/hackathons', data);
  return response.data?.data ?? response.data;
};

export const registerHackathonApi = async (data) => {
  const response = await api.post('/hackathons/register', data);
  return response.data?.data ?? response.data;
};
