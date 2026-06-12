import API from './axios.js';

export const updateParticipantProfileApi = async (profileData) => {
  const response = await API.put('/participant/profile', profileData);
  return response.data;
};
