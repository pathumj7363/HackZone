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

export const getMyTeamApi = async () => {
  const response = await API.get('/teams/mine');
  return response.data;
};

export const getMyInvitesApi = async () => {
  const response = await API.get('/teams/my-invites');
  return response.data;
};

export const joinTeamApi = async (code) => {
  const response = await API.post('/teams/join', { code });
  return response.data;
};

export const getAllTeamsApi = async () => {
  const response = await API.get('/teams');
  return response.data;
};
