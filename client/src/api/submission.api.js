import API from './axios.js';

export const submitProjectApi = async (submissionData) => {
  const response = await API.post('/submissions', submissionData);
  return response.data;
};

export const getMySubmissionsApi = async () => {
  const response = await API.get('/submissions/mine');
  return response.data;
};

export const getAllSubmissionsApi = async () => {
  const response = await API.get('/submissions');
  return response.data;
};
