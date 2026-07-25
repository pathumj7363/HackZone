import API from './axios.js';

export const submitProjectApi = async (submissionData) => {
  const response = await API.post('/submissions', submissionData);
  return response.data;
};

export const getMySubmissionsApi = async () => {
  try {
    const response = await API.get('/submissions/my-submissions');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching my submissions:', error);
    throw error.response?.data || { error: 'Network error occurred' };
  }
};

export const getHackathonSubmissionsApi = async (hackathonId) => {
  try {
    const response = await API.get(`/submissions/hackathon/${hackathonId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching hackathon submissions:', error);
    throw error.response?.data || { error: 'Network error occurred' };
  }
};

export const getAllSubmissionsApi = async () => {
  const response = await API.get('/submissions');
  return response.data;
};
