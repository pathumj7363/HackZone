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

// Organizer-only: fetch hackathons created by the logged-in organizer
export const getMyHackathonsApi = async () => {
  const response = await api.get('/hackathons/my-hackathons');
  return response.data?.data ?? response.data;
};

export const createHackathonApi = async (data) => {
  const response = await api.post('/hackathons', data);
  return response.data?.data ?? response.data;
};

export const registerHackathonApi = async (data) => {
  // If data is FormData, headers are automatically handled by Axios
  let headers = {};
  if (data instanceof FormData) {
    headers['Content-Type'] = 'multipart/form-data';
  }
  const response = await api.post('/hackathons/register', data, { headers });
  return response.data?.data ?? response.data;
};

export const getHackathonRegistrationsApi = async (id) => {
  const response = await api.get(`/hackathons/${id}/registrations`);
  return response.data?.data ?? response.data;
};

export const updateRegistrationStatusApi = async (hackathonId, registrationId, status) => {
  const response = await api.put(`/hackathons/${hackathonId}/registrations/${registrationId}/status`, { status });
  return response.data?.data ?? response.data;
};

export const getMyRegisteredHackathonsApi = async () => {
  const response = await api.get('/hackathons/participant/registered');
  return response.data?.data ?? response.data;
};
