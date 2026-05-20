// Mocked Evaluation API
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getAssignedProjectsApi = async () => {
  await delay(400);
  return [
    { id: 's1', title: 'AI Assistant', teamName: 'Code Wizards', status: 'Pending' }
  ];
};

export const submitEvaluationApi = async (projectId, scoreData) => {
  await delay(400);
  return { success: true };
};
