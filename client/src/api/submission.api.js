import API from './axios.js';

export const submitProjectApi = async (submissionData) => {
  const response = await API.post('/submissions', submissionData);
  return response.data;
};
