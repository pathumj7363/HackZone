import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hackzone',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function clearData() {
  try {
    console.log("Starting data deletion (excluding users)...");
    
    // Disable foreign key checks to allow clearing dependent tables easily
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');

    // List of tables to clear
    const tables = [
      'submissions',
      'team_invites',
      'team_members',
      'teams',
      'hackathon_registrations',
      'hackathons'
      // 'users' is explicitly omitted
    ];

    for (const table of tables) {
      console.log(`Clearing ${table}...`);
      await pool.query(`TRUNCATE TABLE ${table}`);
      console.log(`✅ Cleared ${table}`);
    }

    // Re-enable foreign key checks
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log("All data cleared successfully! You can now start the workflow from the beginning.");
    process.exit(0);
  } catch (error) {
    console.error("Error clearing data:", error);
    process.exit(1);
  }
}

clearData();
