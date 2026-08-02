import pool from './db.js';

const createUsersTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'participant'
      )
    `;
    
    await pool.query(query);

    // Ensure profilePicture column exists (for migrating existing databases)
    try {
      await pool.query('ALTER TABLE users ADD COLUMN profilePicture VARCHAR(255) DEFAULT NULL');
      console.log("ℹ️ Added profilePicture column to users table.");
    } catch (e) {
      // Ignore error if column already exists (ER_DUP_FIELDNAME)
    }

    console.log("✅ Users table initialized successfully!");
    
    // Close the pool so the script exits properly
    await pool.end();
  } catch (error) {
    console.error("❌ Error initializing users table:", error);
    process.exit(1);
  }
};

createUsersTable();
