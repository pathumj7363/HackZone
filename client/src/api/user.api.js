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

export const getMyProfileApi = async () => {
  try {
    const response = await API.get('/users/profile/me');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching my profile:', error);
    throw error.response?.data || { error: 'Network error occurred' };
  }
};

export const getPublicProfileApi = async (userId) => {
  try {
    const response = await API.get(`/users/profile/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching public profile:', error);
    throw error.response?.data || { error: 'Network error occurred' };
  }
};

export const updateParticipantProfileApi = async (data) => {
  try {
    const response = await API.put('/users/profile/participant', data);
    return response.data;
  } catch (error) {
    console.error('Error updating participant profile:', error);
    throw error.response?.data || { error: 'Network error occurred' };
  }
};

export const updateJudgeProfileApi = async (data) => {
  try {
    const response = await API.put('/users/profile/judge', data);
    return response.data;
  } catch (error) {
    console.error('Error updating judge profile:', error);
    throw error.response?.data || { error: 'Network error occurred' };
  }
};

export const updateOrganizerProfileApi = async (data) => {
  try {
    const response = await API.put('/users/profile/organizer', data);
    return response.data;
  } catch (error) {
    console.error('Error updating organizer profile:', error);
    throw error.response?.data || { error: 'Network error occurred' };
  }
};

export const uploadProfilePictureApi = async (file) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await API.post('/users/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error.response?.data || { error: 'Network error occurred' };
  }
};
