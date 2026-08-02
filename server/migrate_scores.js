import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hackzone',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    console.log("Updating averageScore for legacy data...");
    await pool.query('UPDATE submissions SET averageScore = averageScore * 10 WHERE averageScore <= 10 AND averageScore > 0');
    console.log("Legacy averageScores updated.");
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
};
run();
