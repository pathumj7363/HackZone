import pool from '../database/db.js';

/**
 * Create a new submission
 */
export const createSubmission = async (id, teamId, hackathonId, title, description, githubRepo, demoVideoUrl) => {
  const query = `
    INSERT INTO submissions (id, teamId, hackathonId, title, description, githubRepo, demoVideoUrl)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  await pool.query(query, [id, teamId, hackathonId, title, description, githubRepo, demoVideoUrl]);
  
  return { id, teamId, hackathonId, title, description, githubRepo, demoVideoUrl };
};

/**
 * Get submission by team ID
 */
export const getSubmissionByTeam = async (teamId) => {
  const query = `SELECT * FROM submissions WHERE teamId = ?`;
  const [rows] = await pool.query(query, [teamId]);
  return rows.length ? rows[0] : null;
};
