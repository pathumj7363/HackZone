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
    SELECT s.*, t.name as teamName, h.title as hackathonName FROM submissions s
    JOIN team_members tm ON s.teamId = tm.teamId
    JOIN teams t ON t.id = s.teamId
    LEFT JOIN hackathons h ON s.hackathonId = h.id
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

export const getSubmissionsWithAssignments = async (hackathonId) => {
  let rows = [];
  try {
    const query = `
      SELECT 
        s.id, s.title, s.githubRepo, s.demoVideoUrl, s.created_at,
        e.id as evaluationId, e.judgeId,
        u.name as judgeName, u.email as judgeEmail, u.occupation as judgeRole, u.expertiseTags as judgeTags
      FROM submissions s
      LEFT JOIN evaluations e ON s.id = e.submissionId
      LEFT JOIN users u ON e.judgeId = u.id
      WHERE s.hackathonId = ?
      ORDER BY s.created_at DESC
    `;
    [rows] = await pool.query(query, [hackathonId]);
  } catch(e) {
    if (e.code === 'ER_NO_SUCH_TABLE') {
      // Return empty if evaluations table isn't created yet
      const fallbackQuery = `SELECT id, title, githubRepo, demoVideoUrl, created_at FROM submissions WHERE hackathonId = ? ORDER BY created_at DESC`;
      [rows] = await pool.query(fallbackQuery, [hackathonId]);
    } else {
      throw e;
    }
  }
  
  // Group by submission
  const submissionsMap = new Map();
  
  for (const row of rows) {
    if (!submissionsMap.has(row.id)) {
      submissionsMap.set(row.id, {
        id: row.id,
        title: row.title,
        githubRepo: row.githubRepo,
        demoVideoUrl: row.demoVideoUrl,
        created_at: row.created_at,
        assigned: []
      });
    }
    
    if (row.judgeId) {
      let tags = [];
      try { tags = typeof row.judgeTags === 'string' ? JSON.parse(row.judgeTags) : row.judgeTags || []; } catch(e){}
      
      const initials = row.judgeName ? row.judgeName.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : '?';
      
      submissionsMap.get(row.id).assigned.push({
        id: row.judgeId,
        name: row.judgeName,
        email: row.judgeEmail,
        role: row.judgeRole,
        tags: tags,
        initials: initials
      });
    }
  }
  
  return Array.from(submissionsMap.values());
};
