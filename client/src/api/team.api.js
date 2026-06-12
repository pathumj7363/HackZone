import API from './axios.js';

export const createTeamApi = async (teamData) => {
  const response = await API.post('/teams', teamData);
  return response.data;
};

export const inviteUserApi = async (inviteData) => {
  const response = await API.post('/teams/invite', inviteData);
  return response.data;
};

export const respondToInviteApi = async (respondData) => {
  const response = await API.post('/teams/invite/respond', respondData);
  return response.data;
};

// We can add fetchTeamDetails later if needed, since the backend model doesn't expose an endpoint for it yet.
// For now, this covers the required functions.
