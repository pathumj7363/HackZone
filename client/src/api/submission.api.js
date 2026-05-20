// Mocked Submission API
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getMySubmissionsApi = async () => {
  await delay(400);
  return [
    { id: 's1', title: 'AI Assistant', hackathonId: '1', status: 'Submitted', score: null }
  ];
};

export const submitProjectApi = async (data) => {
  await delay(500);
  return { success: true, id: Date.now().toString() };
};

export const getAllSubmissionsApi = async () => {
  await delay(400);
  return [
    { id: 's1', title: 'AI Assistant', teamName: 'Code Wizards' },
    { id: 's2', title: 'Smart Home IoT', teamName: 'Byte Me' }
  ];
};
