import pool from '../database/db.js';

// Auto-migrate profile columns
(async () => {
  try {
    const migrations = [
      'ALTER TABLE users ADD COLUMN profilePicture VARCHAR(255) DEFAULT NULL',
      'ALTER TABLE users ADD COLUMN skills JSON',
      'ALTER TABLE users ADD COLUMN githubUrl VARCHAR(255) DEFAULT NULL',
      'ALTER TABLE users ADD COLUMN linkedInUrl VARCHAR(255) DEFAULT NULL',
      'ALTER TABLE users ADD COLUMN bio TEXT',
      'ALTER TABLE users ADD COLUMN occupation VARCHAR(255) DEFAULT NULL',
      'ALTER TABLE users ADD COLUMN expertiseTags JSON',
      'ALTER TABLE users ADD COLUMN organizationName VARCHAR(255) DEFAULT NULL',
      'ALTER TABLE users ADD COLUMN websiteUrl VARCHAR(255) DEFAULT NULL',
      'ALTER TABLE users ADD COLUMN isVerified BOOLEAN DEFAULT FALSE'
    ];

    for (const migration of migrations) {
      try {
        await pool.query(migration);
      } catch (e) {
        // Ignore duplicate column errors
      }
    }
    console.log("ℹ️ User table profile columns verified/migrated.");
  } catch (e) {
    console.error("Migration error:", e);
  }
})();

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
 * Fetch a user by their ID.
 * @param {string} id 
 * @returns {Promise<Object|null>} The user object or null if not found
 */
export const getUserById = async (id) => {
  const query = `SELECT * FROM users WHERE id = ?`;
  const [rows] = await pool.query(query, [id]);
  
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

/**
 * Update an organizer's specific profile fields.
 * @param {string} id - User ID
 * @param {Object} profileData - Object containing organizationName, websiteUrl, isVerified
 * @returns {Promise<boolean>} True if update was successful
 */
export const updateOrganizerProfile = async (id, profileData) => {
  const { organizationName, websiteUrl, isVerified } = profileData;

  const query = `
    UPDATE users 
    SET organizationName = ?, websiteUrl = ?, isVerified = ?
    WHERE id = ? AND role = 'organizer'
  `;

  const [result] = await pool.query(query, [organizationName, websiteUrl, isVerified, id]);
  return result.affectedRows > 0;
};

/**
 * Fetch users by their role.
 * @param {string} role 
 * @returns {Promise<Array>} List of users with the specified role
 */
export const getUsersByRole = async (role) => {
  try {
    if (!role) throw new Error('Role is required');
    const query = `SELECT * FROM users WHERE role = ?`;
    const [rows] = await pool.query(query, [role]);
    return rows;
  } catch (error) {
    console.error('Error fetching users by role:', error);
    throw error;
  }
};

/**
 * Search users by name or email
 * @param {string} searchQuery 
 * @returns {Promise<Array>} List of matching users
 */
export const searchUsers = async (searchQuery) => {
  try {
    const query = `
      SELECT id, name, email, role, profilePicture 
      FROM users 
      WHERE (name LIKE ? OR email LIKE ?) AND role != 'admin'
      LIMIT 20
    `;
    const likeParam = `%${searchQuery}%`;
    const [rows] = await pool.query(query, [likeParam, likeParam]);
    return rows;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

/**
 * Update user's profile picture
 * @param {string} id - User ID
 * @param {string} profilePicture - URL or path to the picture
 * @returns {Promise<boolean>}
 */
export const updateProfilePicture = async (id, profilePicture) => {
  try {
    const query = `UPDATE users SET profilePicture = ? WHERE id = ?`;
    const [result] = await pool.query(query, [profilePicture, id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw error;
  }
};
