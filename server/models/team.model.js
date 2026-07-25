import pool from '../database/db.js';

// Auto-migrate tables
(async () => {
  try {
    const createTeamsQuery = `
      CREATE TABLE IF NOT EXISTS teams (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        leaderId VARCHAR(255) NOT NULL,
        hackathonId VARCHAR(255),
        maxCapacity INT DEFAULT 4,
        inviteCode VARCHAR(255) UNIQUE,
        description TEXT,
        isPublic TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    const createTeamMembersQuery = `
      CREATE TABLE IF NOT EXISTS team_members (
        teamId VARCHAR(255) NOT NULL,
        userId VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'member',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (teamId, userId)
      )
    `;
    const createTeamInvitesQuery = `
      CREATE TABLE IF NOT EXISTS team_invites (
        id VARCHAR(255) PRIMARY KEY,
        teamId VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(createTeamsQuery);
    await pool.query(createTeamMembersQuery);
    await pool.query(createTeamInvitesQuery);

    // Auto-migrate new columns for existing installations
    const alterQueries = [
      "ALTER TABLE teams ADD COLUMN inviteCode VARCHAR(255) UNIQUE;",
      "ALTER TABLE teams ADD COLUMN description TEXT;",
      "ALTER TABLE teams ADD COLUMN isPublic TINYINT(1) DEFAULT 1;",
      "ALTER TABLE teams MODIFY COLUMN hackathonId VARCHAR(255) NULL;"
    ];
    for (let q of alterQueries) {
      try {
        await pool.query(q);
      } catch (e) {
        // Column may already exist or hackathonId already nullable
      }
    }

    console.log("✅ Verified teams tables and schema columns");
  } catch (err) {
    console.error("Error creating teams tables:", err);
  }
})();

/**
 * Create a new team
 */
export const createTeam = async (id, name, leaderId, hackathonId = null, maxCapacity = 4, inviteCode = null, description = '', isPublic = true) => {
  const finalHackathonId = hackathonId && hackathonId.trim() !== '' ? hackathonId : 'general';
  const query = `
    INSERT INTO teams (id, name, leaderId, hackathonId, maxCapacity, inviteCode, description, isPublic)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await pool.query(query, [id, name, leaderId, finalHackathonId, maxCapacity, inviteCode, description, isPublic ? 1 : 0]);

  // Also add the leader as a member
  await addTeamMember(id, leaderId, 'leader');

  return { id, name, leaderId, hackathonId: finalHackathonId, maxCapacity, inviteCode, description, isPublic };
};

/**
 * Get team by ID
 */
export const getTeamById = async (id) => {
  const query = `SELECT * FROM teams WHERE id = ?`;
  const [rows] = await pool.query(query, [id]);
  return rows.length ? rows[0] : null;
};

/**
 * Add a member to a team
 */
export const addTeamMember = async (teamId, userId, role = 'member') => {
  const query = `
    INSERT INTO team_members (teamId, userId, role)
    VALUES (?, ?, ?)
  `;
  await pool.query(query, [teamId, userId, role]);
  return true;
};

/**
 * Create a team invite
 */
export const createTeamInvite = async (id, teamId, email) => {
  const query = `
    INSERT INTO team_invites (id, teamId, email, status)
    VALUES (?, ?, ?, 'pending')
  `;
  await pool.query(query, [id, teamId, email]);
  return { id, teamId, email, status: 'pending' };
};

/**
 * Update a team invite status
 */
export const updateTeamInviteStatus = async (id, status) => {
  const query = `
    UPDATE team_invites SET status = ? WHERE id = ?
  `;
  const [result] = await pool.query(query, [status, id]);
  return result.affectedRows > 0;
};

export const getMyTeam = async (userId) => {
  const query = `
    SELECT t.* FROM teams t
    JOIN team_members tm ON t.id = tm.teamId
    WHERE tm.userId = ?
    LIMIT 1
  `;
  const [rows] = await pool.query(query, [userId]);
  if (!rows.length) return null;
  const team = rows[0];

  const memberQuery = `
    SELECT u.name, u.email, tm.role 
    FROM team_members tm
    JOIN users u ON tm.userId = u.id
    WHERE tm.teamId = ?
  `;
  const [memberRows] = await pool.query(memberQuery, [team.id]);
  team.members = memberRows.map(m => m.name || m.email);
  return team;
};

export const getAllTeams = async () => {
  const query = `
    SELECT t.*, 
           COUNT(tm.userId) as membersCount,
           u.name as leaderName
    FROM teams t
    LEFT JOIN team_members tm ON t.id = tm.teamId
    LEFT JOIN users u ON t.leaderId = u.id
    GROUP BY t.id
    ORDER BY t.created_at DESC
  `;
  const [rows] = await pool.query(query);
  return rows;
};

export const joinTeam = async (code, userId) => {
  const query = `SELECT id FROM teams WHERE inviteCode = ? OR name = ? OR id = ? LIMIT 1`;
  const [rows] = await pool.query(query, [code, code, code]);
  if (!rows.length) throw new Error('Invalid team code');
  await addTeamMember(rows[0].id, userId, 'member');
  return true;
};

export const getTeamByUserId = async (userId) => {
  const query = `
    SELECT t.* FROM teams t
    JOIN team_members tm ON t.id = tm.teamId
    WHERE tm.userId = ?
    LIMIT 1
  `;
  const [rows] = await pool.query(query, [userId]);
  return rows.length ? rows[0] : null;
};

export const getPendingInvitesByEmail = async (email) => {
  const query = `
    SELECT ti.id, ti.teamId, ti.email, ti.status, ti.created_at,
           t.name as teamName,
           h.title as hackathon,
           u.name as inviter
    FROM team_invites ti
    JOIN teams t ON ti.teamId = t.id
    JOIN hackathons h ON t.hackathonId = h.id
    LEFT JOIN users u ON t.leaderId = u.id
    WHERE ti.email = ? AND ti.status = 'pending'
  `;
  const [rows] = await pool.query(query, [email]);
  return rows;
};

export const getInvitesByTeamId = async (teamId) => {
  const query = `
    SELECT id, teamId, email, status, created_at
    FROM team_invites
    WHERE teamId = ?
    ORDER BY created_at DESC
  `;
  const [rows] = await pool.query(query, [teamId]);
  return rows;
};
