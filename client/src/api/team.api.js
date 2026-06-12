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

// --- Mocks to prevent UI crashes for unimplemented endpoints ---
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getMyTeamApi = async () => {
  await delay(400);
  return { id: 't1', name: 'Code Wizards', members: ['User A', 'User B'], code: 'WIZ123' };
};

export const joinTeamApi = async (code) => {
  await delay(400);
  if (code === 'WIZ123') return { success: true, message: 'Joined team!' };
  throw new Error('Invalid team code');
};

export const getAllTeamsApi = async () => {
  await delay(400);
  return [
    { id: 't1', name: 'Code Wizards', members: 2 },
    { id: 't2', name: 'Byte Me', members: 4 }
  ];
};
// We can add fetchTeamDetails later if needed, since the backend model doesn't expose an endpoint for it yet.
// For now, this covers the required functions.
