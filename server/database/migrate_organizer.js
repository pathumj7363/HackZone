import pool from './db.js';

const migrateOrganizerPhase = async () => {
  try {
    console.log("Running Organizer Migrations...");

    // 1. Extend users table for organizer fields
    const addUsersColumnsQueries = [
      "ALTER TABLE users ADD COLUMN organizationName VARCHAR(255);",
      "ALTER TABLE users ADD COLUMN websiteUrl VARCHAR(255);",
      "ALTER TABLE users ADD COLUMN isVerified BOOLEAN DEFAULT FALSE;"
    ];

    for (let q of addUsersColumnsQueries) {
      try {
        await pool.query(q);
        console.log(`Successfully executed: ${q}`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`Column already exists, skipping: ${q}`);
        } else {
          throw err;
        }
      }
    }

    // 2. Extend hackathons table for organizer fields
    const addHackathonsColumnsQueries = [
      "ALTER TABLE hackathons ADD COLUMN rules TEXT;",
      "ALTER TABLE hackathons ADD COLUMN prizes JSON;",
      "ALTER TABLE hackathons ADD COLUMN sponsors JSON;",
      "ALTER TABLE hackathons ADD COLUMN judges JSON;",
      "ALTER TABLE hackathons ADD COLUMN organizerId VARCHAR(255);"
    ];

    for (let q of addHackathonsColumnsQueries) {
      try {
        await pool.query(q);
        console.log(`Successfully executed: ${q}`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`Column already exists, skipping: ${q}`);
        } else {
          throw err;
        }
      }
    }

    console.log("✅ Organizer Migrations Complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during migration:", error);
    process.exit(1);
  }
};

migrateOrganizerPhase();
