import pool from './db.js';

const addColumns = async () => {
  try {
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
        console.log(`Successfully executed: ${q}`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`Column already exists, skipping: ${q}`);
        } else {
          console.error(`Error with ${q}:`, err);
        }
      }
    }
    console.log('Columns added successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
};

addColumns();
