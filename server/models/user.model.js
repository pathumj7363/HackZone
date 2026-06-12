import pool from '../database/db.js';

/**
 * Fetch a user by their email address.
 * @param {string} email 
 * @returns {Promise<Object|null>} The user object or null if not found
 */
export const findUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = ?`;

  // pool.query returns [rows, fields]
  const [rows] = await pool.query(query, [email]);

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
};

/**
 * Insert a new user into the database.
 * @param {string} id - Unique identifier (e.g. UUID or Date.now().toString())
 * @param {string} name - User's full name
 * @param {string} email - User's email address
 * @param {string} password_hash - The bcrypt hashed password
 * @param {string} role - The user's role (e.g. 'participant', 'organizer', 'judge')
 * @returns {Promise<Object>} The created user object
 */
export const createUser = async (id, name, email, password_hash, role) => {
  const query = `
    INSERT INTO users (id, name, email, password_hash, role) 
    VALUES (?, ?, ?, ?, ?)
  `;

  await pool.query(query, [id, name, email, password_hash, role]);

  // Return the user object (excluding password hash)
  return { id, name, email, role };
};

/**
 * Update a judge's specific profile fields.
 * @param {string} id - User ID
 * @param {Object} profileData - Object containing occupation, expertiseTags, and linkedInUrl
 * @returns {Promise<boolean>} True if update was successful
 */
export const updateJudgeProfile = async (id, profileData) => {
  const { occupation, expertiseTags, linkedInUrl } = profileData;
  const tagsJson = expertiseTags ? JSON.stringify(expertiseTags) : null;
  
  const query = `
    UPDATE users 
    SET occupation = ?, expertiseTags = ?, linkedInUrl = ?
    WHERE id = ? AND role = 'judge'
  `;
  
  const [result] = await pool.query(query, [occupation, tagsJson, linkedInUrl, id]);
  return result.affectedRows > 0;
};

/**
 * Update a participant's specific profile fields.
 * @param {string} id - User ID
 * @param {Object} profileData - Object containing skills, githubUrl, linkedInUrl, bio
 * @returns {Promise<boolean>} True if update was successful
 */
export const updateParticipantProfile = async (id, profileData) => {
  const { skills, githubUrl, linkedInUrl, bio } = profileData;
  const skillsJson = skills ? JSON.stringify(skills) : null;
  
  const query = `
    UPDATE users 
    SET skills = ?, githubUrl = ?, linkedInUrl = ?, bio = ?
    WHERE id = ? AND role = 'participant'
  `;
  
  const [result] = await pool.query(query, [skillsJson, githubUrl, linkedInUrl, bio, id]);
  return result.affectedRows > 0;
};
