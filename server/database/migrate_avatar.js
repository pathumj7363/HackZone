import pool from './db.js';

const addProfilePictureColumn = async () => {
  try {
    const query = `
      ALTER TABLE users 
      ADD COLUMN profilePicture VARCHAR(255) DEFAULT NULL
    `;
    
    await pool.query(query);
    console.log("✅ Added profilePicture column to users table successfully!");
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log("ℹ️ profilePicture column already exists.");
    } else {
      console.error("❌ Error altering users table:", error);
    }
  } finally {
    await pool.end();
    process.exit(0);
  }
};

addProfilePictureColumn();
