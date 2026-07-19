import pool from '../database/db.js';

// Auto-migrate new columns and ensure table exists
(async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS hackathons (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        startDate DATETIME,
        endDate DATETIME,
        rules TEXT,
        prizes JSON,
        sponsors JSON,
        judges JSON,
        organizerId VARCHAR(255),
        status VARCHAR(50) DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(createTableQuery);
  } catch (err) {
    console.error("Error creating hackathons table:", err);
  }

  const queries = [
    "ALTER TABLE hackathons ADD COLUMN location VARCHAR(255);",
    "ALTER TABLE hackathons ADD COLUMN theme VARCHAR(255);",
    "ALTER TABLE hackathons ADD COLUMN maxTeamSize INT DEFAULT 4;",
    "ALTER TABLE hackathons ADD COLUMN prizePool VARCHAR(255);",
    "ALTER TABLE hackathons ADD COLUMN image TEXT;"
  ];
  for (let q of queries) {
    try {
      await pool.query(q);
    } catch (e) {
      // Ignore if column already exists
    }
  }
  console.log("✅ Verified hackathon table and metadata columns");
})();

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
      prizes, sponsors, judges, organizerId, status,
      location, theme, maxTeamSize, prizePool, image
    } = hackathonData;

    if (!id || !title || !organizerId) {
      throw new Error('Missing essential hackathon fields (id, title, organizerId)');
    }

    const prizesJson = prizes ? JSON.stringify(prizes) : null;
    const sponsorsJson = sponsors ? JSON.stringify(sponsors) : null;
    const judgesJson = judges ? JSON.stringify(judges) : null;
    const hackathonStatus = status || 'draft';

    const query = `
      INSERT INTO hackathons (
        id, title, description, startDate, endDate, rules, 
        prizes, sponsors, judges, organizerId, status,
        location, theme, maxTeamSize, prizePool, image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(query, [
      id, 
      title, 
      description || null, 
      startDate, 
      endDate, 
      rules || null,
      prizesJson, 
      sponsorsJson, 
      judgesJson, 
      organizerId,
      hackathonStatus,
      location || null,
      theme || null,
      maxTeamSize || 4,
      prizePool || null,
      image || null
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
    if (updateData.location !== undefined) { fields.push('location = ?'); values.push(updateData.location); }
    if (updateData.theme !== undefined) { fields.push('theme = ?'); values.push(updateData.theme); }
    if (updateData.maxTeamSize !== undefined) { fields.push('maxTeamSize = ?'); values.push(updateData.maxTeamSize); }
    if (updateData.prizePool !== undefined) { fields.push('prizePool = ?'); values.push(updateData.prizePool); }
    if (updateData.image !== undefined) { fields.push('image = ?'); values.push(updateData.image); }

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
