import pool from '../database/db.js';
import crypto from 'crypto';

// Auto-migrate tables
(async () => {
  try {
    const createInvitationsQuery = `
      CREATE TABLE IF NOT EXISTS judge_invitations (
        id VARCHAR(255) PRIMARY KEY,
        hackathonId VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        userId VARCHAR(255) DEFAULT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (hackathonId) REFERENCES hackathons(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
        UNIQUE KEY unique_invite (hackathonId, email)
      )
    `;
    await pool.query(createInvitationsQuery);
    console.log("✅ Verified judge_invitations table");
  } catch (err) {
    console.error("Error creating judge_invitations table:", err);
  }
})();

/**
 * Create a new invitation for a judge to a hackathon
 */
export const createJudgeInvitation = async (hackathonId, email, userId = null) => {
  const id = crypto.randomUUID();
  const query = `
    INSERT INTO judge_invitations (id, hackathonId, email, userId, status)
    VALUES (?, ?, ?, ?, 'pending')
  `;
  try {
    await pool.query(query, [id, hackathonId, email, userId]);
    return { id, hackathonId, email, userId, status: 'pending' };
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      throw new Error('An invitation has already been sent to this email for this hackathon.');
    }
    throw err;
  }
};

/**
 * Get all invitations sent for a specific hackathon (Organizer view)
 */
export const getInvitationsByHackathon = async (hackathonId) => {
  const query = `
    SELECT i.*, u.name as judgeName, u.occupation as judgeRole
    FROM judge_invitations i
    LEFT JOIN users u ON i.userId = u.id OR i.email = u.email
    WHERE i.hackathonId = ?
    ORDER BY i.created_at DESC
  `;
  const [rows] = await pool.query(query, [hackathonId]);
  return rows;
};

/**
 * Get all pending invitations for a specific user/email (Judge view)
 */
export const getPendingInvitationsForUser = async (email, userId) => {
  // Update userId for any invites that were sent by email before the user signed up
  if (userId && email) {
    await pool.query(`UPDATE judge_invitations SET userId = ? WHERE email = ? AND userId IS NULL`, [userId, email]);
  }
  
  const query = `
    SELECT i.*, h.title as hackathonTitle, h.image as hackathonImage
    FROM judge_invitations i
    JOIN hackathons h ON i.hackathonId = h.id
    WHERE (i.email = ? OR i.userId = ?) AND i.status = 'pending'
    ORDER BY i.created_at DESC
  `;
  const [rows] = await pool.query(query, [email, userId]);
  return rows;
};

/**
 * Accept or decline an invitation
 */
export const updateInvitationStatus = async (inviteId, userId, email, status) => {
  if (!['accepted', 'declined'].includes(status)) {
    throw new Error('Invalid status');
  }
  
  // Verify ownership
  const [invites] = await pool.query(`SELECT id FROM judge_invitations WHERE id = ? AND (userId = ? OR email = ?)`, [inviteId, userId, email]);
  if (invites.length === 0) {
    throw new Error('Invitation not found or unauthorized');
  }

  const query = `UPDATE judge_invitations SET status = ? WHERE id = ?`;
  await pool.query(query, [status, inviteId]);
  return true;
};

/**
 * Get all hackathons a judge has accepted
 */
export const getAcceptedHackathonsForJudge = async (userId, email) => {
  const query = `
    SELECT h.*
    FROM hackathons h
    JOIN judge_invitations i ON h.id = i.hackathonId
    WHERE (i.userId = ? OR i.email = ?) AND i.status = 'accepted'
  `;
  const [rows] = await pool.query(query, [userId, email]);
  return rows;
};
