import API from './axios.js';

/**
 * Fetch all submissions assigned to the currently logged-in judge.
 * @returns {Promise<Array>} Array of assigned evaluations/submissions
 */
export const getAssignedSubmissions = async () => {
  try {
    const response = await API.get('/evaluations/assigned');
    return response.data.data; // Server returns { data: [...] }
  } catch (error) {
    console.error('Error fetching assigned submissions:', error);
    throw error.response?.data || { error: 'Network error occurred' };
  }
};

/**
 * Submit a new evaluation for a project.
 * @param {string} submissionId 
 * @param {string} hackathonId 
 * @param {Object} scores - { innovationScore, technicalComplexityScore, designScore, usabilityScore, feedback }
 * @returns {Promise<Object>} Created evaluation data
 */
export const submitEvaluation = async (submissionId, hackathonId, scores) => {
  try {
    const payload = { submissionId, hackathonId, scores };
    const response = await API.post('/evaluations', payload);
    return response.data.data;
  } catch (error) {
    console.error('Error submitting evaluation:', error);
    throw error.response?.data || { error: 'Network error occurred' };
  }
};

/**
 * Update an existing evaluation.
 * @param {string} evaluationId 
 * @param {Object} scores - { innovationScore, technicalComplexityScore, designScore, usabilityScore, feedback }
 * @param {string} submissionId - Optional, used to trigger average score recalculation
 * @returns {Promise<Object>} 
 */
export const updateEvaluation = async (evaluationId, scores, submissionId = null) => {
  try {
    const payload = { scores, submissionId };
    const response = await API.put(`/evaluations/${evaluationId}`, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating evaluation:', error);
    throw error.response?.data || { error: 'Network error occurred' };
  }
};

/**
 * Fetch the leaderboard for a given hackathon.
 * @param {string} hackathonId
 * @returns {Promise<Array>} Array of leaderboard data
 */
export const getLeaderboard = async (hackathonId) => {
  try {
    const response = await API.get(`/evaluations/leaderboard/${hackathonId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error.response?.data || { error: 'Network error occurred' };
  }
};

// =========================================================================
// BACKWARDS COMPATIBILITY ALIASES
// Exporting the old function names so the existing UI doesn't crash
// These will be fully replaced when we build the new UI in Phase 4 & 5
// =========================================================================

export const getAssignedProjectsApi = async () => {
  return getAssignedSubmissions();
};

export const getProjectByIdApi = async (id) => {
  // Stub for now until UI is rebuilt
  return { id, title: 'Loading...', description: 'Loading...', status: 'Pending' };
};

export const submitEvaluationApi = async (projectId, evaluationData) => {
  // Stub for now
  return { success: true };
};

export const saveDraftEvaluationApi = async (projectId, evaluationData) => {
  // Stub for now
  return { success: true };
};
