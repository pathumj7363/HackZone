import pool from '../database/db.js';

/**
 * Submit a new evaluation for a project
 * @param {string} id - Unique identifier for the evaluation
 * @param {string} submissionId - ID of the submission being evaluated
 * @param {string} judgeId - ID of the judge
 * @param {string} hackathonId - ID of the hackathon
 * @param {Object} scores - Object containing innovationScore, technicalComplexityScore, designScore, usabilityScore, feedback
 * @returns {Promise<Object>} The created evaluation
 */
export const createEvaluation = async (id, submissionId, judgeId, hackathonId, scores) => {
  const { innovationScore, technicalComplexityScore, designScore, usabilityScore, feedback } = scores;
  
  const query = `
    INSERT INTO evaluations (
      id, submissionId, judgeId, hackathonId, 
      innovationScore, technicalComplexityScore, designScore, usabilityScore, feedback
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  await pool.query(query, [
    id, submissionId, judgeId, hackathonId, 
    innovationScore, technicalComplexityScore, designScore, usabilityScore, feedback
  ]);
  
  return { id, submissionId, judgeId, hackathonId, ...scores };
};

/**
 * Fetch evaluations for a specific submission
 * @param {string} submissionId 
 * @returns {Promise<Array>} Array of evaluations
 */
export const getEvaluationsBySubmissionId = async (submissionId) => {
  const query = `SELECT * FROM evaluations WHERE submissionId = ?`;
  const [rows] = await pool.query(query, [submissionId]);
  return rows;
};

/**
 * Fetch evaluations made by a specific judge
 * @param {string} judgeId 
 * @returns {Promise<Array>} Array of evaluations
 */
export const getEvaluationsByJudgeId = async (judgeId) => {
  const query = `
    SELECT e.*, 
           s.title as submissionTitle, s.githubRepo, s.demoVideoUrl
    FROM evaluations e
    LEFT JOIN submissions s ON e.submissionId = s.id
    WHERE e.judgeId = ?
  `;
  try {
    const [rows] = await pool.query(query, [judgeId]);
    return rows;
  } catch (err) {
    // Fallback if submissions table is not fully joined or created yet
    if (err.code === 'ER_NO_SUCH_TABLE') {
      const fallbackQuery = `SELECT * FROM evaluations WHERE judgeId = ?`;
      const [rows] = await pool.query(fallbackQuery, [judgeId]);
      return rows;
    }
    throw err;
  }
};

/**
 * Update an existing evaluation
 * @param {string} id - Evaluation ID
 * @param {Object} scores - Object containing innovationScore, technicalComplexityScore, designScore, usabilityScore, feedback
 * @returns {Promise<boolean>} True if updated
 */
export const updateEvaluation = async (id, scores) => {
  const { innovationScore, technicalComplexityScore, designScore, usabilityScore, feedback } = scores;
  
  const query = `
    UPDATE evaluations 
    SET innovationScore = ?, technicalComplexityScore = ?, designScore = ?, usabilityScore = ?, feedback = ?
    WHERE id = ?
  `;
  
  const [result] = await pool.query(query, [
    innovationScore, technicalComplexityScore, designScore, usabilityScore, feedback, id
  ]);
  
  return result.affectedRows > 0;
};

/**
 * Fetch leaderboard data for a hackathon
 * @param {string} hackathonId 
 * @param {string} judgeId 
 * @returns {Promise<Array>} Array of leaderboard entries
 */
export const getLeaderboardData = async (hackathonId, judgeId) => {
  const query = `
    SELECT 
      s.id, s.title, s.githubRepo, s.demoVideoUrl, s.averageScore,
      (SELECT COUNT(*) FROM evaluations e WHERE e.submissionId = s.id AND e.judgeId = ?) as hasEvaluated
    FROM submissions s
    WHERE s.hackathonId = ?
    ORDER BY s.averageScore DESC
  `;
  try {
    const [rows] = await pool.query(query, [judgeId, hackathonId]);
    return rows.map(r => ({ ...r, hasEvaluated: r.hasEvaluated > 0 }));
  } catch (err) {
    if (err.code === 'ER_NO_SUCH_TABLE') {
      return [];
    }
    throw err;
  }
};
