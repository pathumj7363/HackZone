import pool from '../database/db.js';

/**
 * Create a new team
 */
export const createTeam = async (id, name, leaderId, hackathonId, maxCapacity = 4) => {
  const query = `
    INSERT INTO teams (id, name, leaderId, hackathonId, maxCapacity)
    VALUES (?, ?, ?, ?, ?)
  `;
  await pool.query(query, [id, name, leaderId, hackathonId, maxCapacity]);
  
  // Also add the leader as a member
  await addTeamMember(id, leaderId, 'leader');
  
  return { id, name, leaderId, hackathonId, maxCapacity };
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
