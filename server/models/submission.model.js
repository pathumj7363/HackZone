import pool from '../database/db.js';

// Auto-migrate tables
(async () => {
  try {
    const createSubmissionsQuery = `
      CREATE TABLE IF NOT EXISTS submissions (
        id VARCHAR(255) PRIMARY KEY,
        teamId VARCHAR(255) NOT NULL,
        hackathonId VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        githubRepo VARCHAR(255),
        demoVideoUrl VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(createSubmissionsQuery);
    console.log("✅ Verified submissions table");
  } catch (err) {
    console.error("Error creating submissions table:", err);
  }
})();

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
 * Get all submissions for a given team, enriched with hackathon details.
 * @param {string} teamId - The team's UUID
 * @returns {Promise<Array>} Array of submission objects with hackathon info
 */
export const getSubmissionsByTeamId = async (teamId) => {
  const query = `
    SELECT 
      s.id,
      s.teamId,
      s.hackathonId,
      s.title,
      s.description,
      s.githubRepo,
      s.demoVideoUrl,
      s.created_at,
      h.title AS hackathonTitle,
      h.status AS hackathonStatus,
      h.endDate AS hackathonEndDate
    FROM submissions s
    JOIN hackathons h ON s.hackathonId = h.id
    WHERE s.teamId = ?
    ORDER BY s.created_at DESC
  `;
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
