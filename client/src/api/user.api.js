import API from './axios.js';

export const getJudgesApi = async (search = '') => {
  try {
    const response = await API.get('/users/judges', { params: { search, limit: 50 } });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching judges:', error);
    throw error.response?.data || { error: 'Network error occurred' };
  }
};

export const searchUsersApi = async (query = '') => {
  try {
    const response = await API.get('/users/search', { params: { q: query } });
    return response.data.data;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error.response?.data || { error: 'Network error occurred' };
  }
};
