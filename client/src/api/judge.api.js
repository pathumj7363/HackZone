import API from './axios.js';

/**
 * Fetch the profile data for the currently logged-in judge.
 * Assuming there's a route to get their own profile.
 * Wait, in Phase 2 we only created a PUT route to update profile. 
 * We'll include updateJudgeProfile here.
 */
export const updateJudgeProfile = async (profileData) => {
  try {
    const response = await API.put('/judge/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating judge profile:', error);
    throw error.response?.data || error.message;
  }
};
