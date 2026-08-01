import pool from '../database/db.js';

// Auto-migrate announcements table
(async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS announcements (
        id VARCHAR(255) PRIMARY KEY,
        hackathonId VARCHAR(255) NOT NULL,
        organizerId VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        audience VARCHAR(50) DEFAULT 'all',
        priority VARCHAR(50) DEFAULT 'normal',
        status VARCHAR(50) DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (hackathonId) REFERENCES hackathons(id) ON DELETE CASCADE,
        FOREIGN KEY (organizerId) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    await pool.query(createTableQuery);
    console.log("✅ Verified announcements table");
  } catch (err) {
    console.error("Error creating announcements table:", err);
  }
})();

export const createAnnouncement = async (announcementData) => {
  try {
    const { id, hackathonId, organizerId, title, content, audience, priority, status } = announcementData;
    const query = `
      INSERT INTO announcements (id, hackathonId, organizerId, title, content, audience, priority, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(query, [id, hackathonId, organizerId, title, content, audience || 'all', priority || 'normal', status || 'draft']);
    return announcementData;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
};

export const getAnnouncementsByHackathonId = async (hackathonId) => {
  try {
    const query = `SELECT * FROM announcements WHERE hackathonId = ? ORDER BY created_at DESC`;
    const [rows] = await pool.query(query, [hackathonId]);
    return rows;
  } catch (error) {
    console.error('Error fetching announcements by hackathon ID:', error);
    throw error;
  }
};

export const getAnnouncementById = async (id) => {
  try {
    const query = `SELECT * FROM announcements WHERE id = ?`;
    const [rows] = await pool.query(query, [id]);
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error('Error fetching announcement by ID:', error);
    throw error;
  }
};

export const updateAnnouncement = async (id, updateData) => {
  try {
    const fields = [];
    const values = [];

    if (updateData.title !== undefined) { fields.push('title = ?'); values.push(updateData.title); }
    if (updateData.content !== undefined) { fields.push('content = ?'); values.push(updateData.content); }
    if (updateData.audience !== undefined) { fields.push('audience = ?'); values.push(updateData.audience); }
    if (updateData.priority !== undefined) { fields.push('priority = ?'); values.push(updateData.priority); }
    if (updateData.status !== undefined) { fields.push('status = ?'); values.push(updateData.status); }

    if (fields.length === 0) return true;

    const query = `UPDATE announcements SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    const [result] = await pool.query(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error updating announcement:', error);
    throw error;
  }
};

export const deleteAnnouncementById = async (id) => {
  try {
    const [result] = await pool.query(`DELETE FROM announcements WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error deleting announcement:', error);
    throw error;
  }
};
