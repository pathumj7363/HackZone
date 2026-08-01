import pool from '../database/db.js';

// Auto-migrate tables
(async () => {
  try {
    const createSubmissionsQuery = `
      CREATE TABLE IF NOT EXISTS submissions (
        id VARCHAR(255) PRIMARY KEY,
        userId VARCHAR(255) NOT NULL,
        teamId VARCHAR(255),
        hackathonId VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        techStack VARCHAR(255),
        githubRepo VARCHAR(255),
        demoVideoUrl VARCHAR(255),
        fileUrl VARCHAR(255),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(createSubmissionsQuery);

    // Migration: add userId and remove NOT NULL from teamId if they exist
    try { await pool.query(`ALTER TABLE submissions ADD COLUMN userId VARCHAR(255) NOT NULL DEFAULT 'unknown'`); } catch(e) {}
    try { await pool.query(`ALTER TABLE submissions MODIFY COLUMN teamId VARCHAR(255) NULL`); } catch(e) {}
    try { await pool.query(`ALTER TABLE submissions ADD COLUMN fileUrl VARCHAR(255) NULL`); } catch(e) {}
    try { await pool.query(`ALTER TABLE submissions ADD COLUMN techStack VARCHAR(255) NULL`); } catch(e) {}
    try { await pool.query(`ALTER TABLE submissions ADD COLUMN notes TEXT NULL`); } catch(e) {}
    console.log("✅ Verified submissions table");
  } catch (err) {
    console.error("Error creating submissions table:", err);
  }
})();

/**
 * Create a new submission
 */
export const createSubmission = async (id, userId, teamId, hackathonId, title, description, techStack, githubRepo, demoVideoUrl, fileUrl, notes) => {
  const query = `
    INSERT INTO submissions (id, userId, teamId, hackathonId, title, description, techStack, githubRepo, demoVideoUrl, fileUrl, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await pool.query(query, [id, userId, teamId || null, hackathonId, title, description, techStack, githubRepo, demoVideoUrl, fileUrl, notes]);

  return { id, userId, teamId, hackathonId, title, description, techStack, githubRepo, demoVideoUrl, fileUrl, notes };
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
    SELECT 
      s.*, 
      COALESCE(t.name, u.name) as teamName, 
      h.title as hackathonName 
    FROM submissions s
    LEFT JOIN team_members tm ON s.teamId = tm.teamId
    LEFT JOIN teams t ON t.id = s.teamId
    LEFT JOIN users u ON s.userId = u.id
    LEFT JOIN hackathons h ON s.hackathonId = h.id
    WHERE s.userId = ? OR tm.userId = ?
    GROUP BY s.id
  `;
  const [rows] = await pool.query(query, [userId, userId]);
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
        s.id, s.title, s.description, s.techStack, s.notes, s.githubRepo, s.demoVideoUrl, s.fileUrl, s.created_at, s.teamId, s.userId,
        t.name as teamName, submitter.name as participantName,
        e.id as evaluationId, e.judgeId,
        u.name as judgeName, u.email as judgeEmail, u.occupation as judgeRole, u.expertiseTags as judgeTags
      FROM submissions s
      LEFT JOIN teams t ON s.teamId = t.id
      LEFT JOIN users submitter ON s.userId = submitter.id
      LEFT JOIN evaluations e ON s.id = e.submissionId
      LEFT JOIN users u ON e.judgeId = u.id
      WHERE s.hackathonId = ?
      ORDER BY s.created_at DESC
    `;
    [rows] = await pool.query(query, [hackathonId]);
  } catch (e) {
    if (e.code === 'ER_NO_SUCH_TABLE') {
      const fallbackQuery = `
        SELECT s.id, s.title, s.description, s.techStack, s.notes, s.githubRepo, s.demoVideoUrl, s.fileUrl, s.created_at, s.teamId, s.userId,
               t.name as teamName, submitter.name as participantName
        FROM submissions s
        LEFT JOIN teams t ON s.teamId = t.id
        LEFT JOIN users submitter ON s.userId = submitter.id
        WHERE s.hackathonId = ? ORDER BY s.created_at DESC
      `;
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
        description: row.description,
        techStack: row.techStack,
        notes: row.notes,
        githubRepo: row.githubRepo,
        demoVideoUrl: row.demoVideoUrl,
        fileUrl: row.fileUrl,
        created_at: row.created_at,
        teamId: row.teamId,
        userId: row.userId,
        teamName: row.teamName,
        participantName: row.participantName,
        assigned: []
      });
    }

    if (row.judgeId) {
      let tags = [];
      try { tags = typeof row.judgeTags === 'string' ? JSON.parse(row.judgeTags) : row.judgeTags || []; } catch (e) { }

      const initials = row.judgeName ? row.judgeName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?';

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
