import api from './axios.js';

export const inviteJudgeApi = async (hackathonId, email) => {
  const response = await api.post('/invitations', { hackathonId, email });
  return response.data;
};

export const getHackathonInvitationsApi = async (hackathonId) => {
  const response = await api.get(`/invitations/hackathon/${hackathonId}`);
  return response.data.data;
};

export const getMyPendingInvitationsApi = async () => {
  const response = await api.get('/invitations/me');
  return response.data.data;
};

export const respondToInvitationApi = async (inviteId, status) => {
  const response = await api.patch(`/invitations/${inviteId}/respond`, { status });
  return response.data;
};
