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
export const getSubmissionsByTeamId = async (teamId) => {
  const query = `SELECT * FROM submissions WHERE teamId = ?`;
  const [rows] = await pool.query(query, [teamId]);
  return rows;
};

export const getMySubmissions = async (userId) => {
  const query = `
    SELECT s.*, t.name as teamName FROM submissions s
    JOIN team_members tm ON s.teamId = tm.teamId
    JOIN teams t ON t.id = s.teamId
    WHERE tm.userId = ?
  `;
  const [rows] = await pool.query(query, [userId]);
  return rows;
};

export const getAllSubmissions = async () => {
  const query = `
    SELECT s.*, t.name as teamName FROM submissions s
    JOIN teams t ON s.teamId = t.id
    ORDER BY s.created_at DESC
  `;
  const [rows] = await pool.query(query);
  return rows;
};
