import pool from '../database/db.js';

/**
 * Create a new hackathon.
 * @param {Object} hackathonData - The hackathon details
 * @returns {Promise<Object>} The created hackathon object
 */
export const createHackathon = async (hackathonData) => {
  try {
    if (!hackathonData) throw new Error('Hackathon data is required');
    
    const {
      id, title, description, startDate, endDate, rules,
      prizes, sponsors, judges, organizerId
    } = hackathonData;

    if (!id || !title || !organizerId) {
      throw new Error('Missing essential hackathon fields (id, title, organizerId)');
    }

    const prizesJson = prizes ? JSON.stringify(prizes) : null;
    const sponsorsJson = sponsors ? JSON.stringify(sponsors) : null;
    const judgesJson = judges ? JSON.stringify(judges) : null;

    const query = `
      INSERT INTO hackathons (
        id, title, description, startDate, endDate, rules, 
        prizes, sponsors, judges, organizerId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(query, [
      id, title, description, startDate, endDate, rules,
      prizesJson, sponsorsJson, judgesJson, organizerId
    ]);

    return hackathonData;
  } catch (error) {
    console.error('Error creating hackathon:', error);
    throw error;
  }
};

export const getAllHackathons = async () => {
  const query = `SELECT * FROM hackathons ORDER BY created_at DESC`;
  const [rows] = await pool.query(query);
  return rows;
};

/**
 * Get a hackathon by ID.
 * @param {string} id 
 * @returns {Promise<Object|null>}
 */
export const getHackathonById = async (id) => {
  try {
    if (!id) throw new Error('Hackathon ID is required');

    const query = `SELECT * FROM hackathons WHERE id = ?`;
    const [rows] = await pool.query(query, [id]);

    if (rows.length === 0) {
      return null;
    }

    const hackathon = rows[0];

    // Parse JSON fields back to objects/arrays
    if (hackathon.prizes) hackathon.prizes = JSON.parse(hackathon.prizes);
    if (hackathon.sponsors) hackathon.sponsors = JSON.parse(hackathon.sponsors);
    if (hackathon.judges) hackathon.judges = JSON.parse(hackathon.judges);

    return hackathon;
  } catch (error) {
    console.error('Error fetching hackathon by ID:', error);
    throw error;
  }
};

/**
 * Get hackathons by Organizer ID.
 * @param {string} organizerId 
 * @returns {Promise<Array>}
 */
export const getHackathonsByOrganizerId = async (organizerId) => {
  try {
    if (!organizerId) throw new Error('Organizer ID is required');

    const query = `SELECT * FROM hackathons WHERE organizerId = ?`;
    const [rows] = await pool.query(query, [organizerId]);

    return rows.map(hackathon => {
      if (hackathon.prizes) hackathon.prizes = JSON.parse(hackathon.prizes);
      if (hackathon.sponsors) hackathon.sponsors = JSON.parse(hackathon.sponsors);
      if (hackathon.judges) hackathon.judges = JSON.parse(hackathon.judges);
      return hackathon;
    });
  } catch (error) {
    console.error('Error fetching hackathons by organizer ID:', error);
    throw error;
  }
};

/**
 * Update an existing hackathon.
 * @param {string} id 
 * @param {Object} updateData 
 * @returns {Promise<boolean>}
 */
export const updateHackathon = async (id, updateData) => {
  try {
    if (!id) throw new Error('Hackathon ID is required for updating');
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new Error('Update data is required');
    }

    const fields = [];
    const values = [];

    if (updateData.title !== undefined) { fields.push('title = ?'); values.push(updateData.title); }
    if (updateData.description !== undefined) { fields.push('description = ?'); values.push(updateData.description); }
    if (updateData.startDate !== undefined) { fields.push('startDate = ?'); values.push(updateData.startDate); }
    if (updateData.endDate !== undefined) { fields.push('endDate = ?'); values.push(updateData.endDate); }
    if (updateData.status !== undefined) { fields.push('status = ?'); values.push(updateData.status); }
    if (updateData.rules !== undefined) { fields.push('rules = ?'); values.push(updateData.rules); }
    if (updateData.prizes !== undefined) { fields.push('prizes = ?'); values.push(JSON.stringify(updateData.prizes)); }
    if (updateData.sponsors !== undefined) { fields.push('sponsors = ?'); values.push(JSON.stringify(updateData.sponsors)); }
    if (updateData.judges !== undefined) { fields.push('judges = ?'); values.push(JSON.stringify(updateData.judges)); }

    if (fields.length === 0) return true;

    const query = `UPDATE hackathons SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    const [result] = await pool.query(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error updating hackathon:', error);
    throw error;
  }
};
