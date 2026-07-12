import pool from './db.js';

const addIndexes = async () => {
  try {
    console.log("Starting index optimization migration...");

    // Add index on users table for role
    const usersRoleIndexQuery = `
      CREATE INDEX idx_users_role ON users (role);
    `;

    // Add index on hackathons table for organizerId
    const hackathonsOrganizerIdIndexQuery = `
      CREATE INDEX idx_hackathons_organizerId ON hackathons (organizerId);
    `;

    console.log("Adding index for user roles...");
    try {
      await pool.query(usersRoleIndexQuery);
      console.log("✅ idx_users_role index created successfully.");
    } catch (err) {
      if (err.code === 'ER_DUP_KEYNAME') {
        console.log("✅ idx_users_role index already exists.");
      } else {
        throw err;
      }
    }

    console.log("Adding index for hackathon organizerId...");
    try {
      await pool.query(hackathonsOrganizerIdIndexQuery);
      console.log("✅ idx_hackathons_organizerId index created successfully.");
    } catch (err) {
      if (err.code === 'ER_DUP_KEYNAME') {
        console.log("✅ idx_hackathons_organizerId index already exists.");
      } else {
        throw err;
      }
    }

    console.log("✅ Index optimization completed successfully.");
    
    // Close the pool
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during index migration:", error);
    process.exit(1);
  }
};

addIndexes();
