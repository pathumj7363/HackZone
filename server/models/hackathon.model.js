import pool from '../database/db.js';

/**
 * Create a new hackathon.
 * @param {Object} hackathonData - The hackathon details
 * @returns {Promise<Object>} The created hackathon object
 */
export const createHackathon = async (hackathonData) => {
  const {
    id, title, description, startDate, endDate, rules, 
    prizes, sponsors, judges, organizerId
  } = hackathonData;

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
};

/**
 * Get a hackathon by ID.
 * @param {string} id 
 * @returns {Promise<Object|null>}
 */
export const getHackathonById = async (id) => {
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
};

/**
 * Get hackathons by Organizer ID.
 * @param {string} organizerId 
 * @returns {Promise<Array>}
 */
export const getHackathonsByOrganizer = async (organizerId) => {
  const query = `SELECT * FROM hackathons WHERE organizerId = ?`;
  const [rows] = await pool.query(query, [organizerId]);

  return rows.map(hackathon => {
    if (hackathon.prizes) hackathon.prizes = JSON.parse(hackathon.prizes);
    if (hackathon.sponsors) hackathon.sponsors = JSON.parse(hackathon.sponsors);
    if (hackathon.judges) hackathon.judges = JSON.parse(hackathon.judges);
    return hackathon;
  });
};

/**
 * Update an existing hackathon.
 * @param {string} id 
 * @param {Object} updateData 
 * @returns {Promise<boolean>}
 */
export const updateHackathon = async (id, updateData) => {
  const {
    title, description, startDate, endDate, rules, 
    prizes, sponsors, judges
  } = updateData;

  const prizesJson = prizes ? JSON.stringify(prizes) : null;
  const sponsorsJson = sponsors ? JSON.stringify(sponsors) : null;
  const judgesJson = judges ? JSON.stringify(judges) : null;

  const query = `
    UPDATE hackathons 
    SET title = ?, description = ?, startDate = ?, endDate = ?, rules = ?, 
        prizes = ?, sponsors = ?, judges = ?
    WHERE id = ?
  `;

  const [result] = await pool.query(query, [
    title, description, startDate, endDate, rules, 
    prizesJson, sponsorsJson, judgesJson, id
  ]);

  return result.affectedRows > 0;
};
