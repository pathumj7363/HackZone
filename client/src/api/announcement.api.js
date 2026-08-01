import axios from 'axios';

const API_URL = 'http://localhost:5000/api/announcements';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const createAnnouncementApi = async (data) => {
  try {
    const res = await axios.post(API_URL, data, getAuthHeaders());
    return res.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAnnouncementsByHackathonApi = async (hackathonId) => {
  try {
    const res = await axios.get(`${API_URL}/hackathon/${hackathonId}`, getAuthHeaders());
    return res.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateAnnouncementApi = async (id, data) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, data, getAuthHeaders());
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteAnnouncementApi = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
