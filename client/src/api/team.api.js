
// Mocked Team API
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getMyTeamApi = async () => {
  await delay(400);
  return { id: 't1', name: 'Code Wizards', members: ['User A', 'User B'], code: 'WIZ123' };
};

export const createTeamApi = async (data) => {
  await delay(400);
  return { id: Date.now().toString(), name: data.name, code: 'NEW123', members: ['Current User'] };
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
