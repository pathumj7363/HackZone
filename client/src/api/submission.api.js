import API from './axios.js';

export const submitProjectApi = async (submissionData) => {
  const response = await API.post('/submissions', submissionData);
  return response.data;
};

// --- Mocks to prevent UI crashes for unimplemented endpoints ---
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getMySubmissionsApi = async () => {
  await delay(400);
  return [
    { id: 's1', title: 'AI Assistant', hackathonId: '1', status: 'Submitted', score: null }
  ];
};

export const getAllSubmissionsApi = async () => {
  await delay(400);
  return [
    { id: 's1', title: 'AI Assistant', teamName: 'Code Wizards' },
    { id: 's2', title: 'Smart Home IoT', teamName: 'Byte Me' }
  ];
};
