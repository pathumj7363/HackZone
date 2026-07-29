import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hackzone'
  });
  
  const [rows] = await connection.execute('SELECT id, title, status FROM hackathons ORDER BY created_at DESC LIMIT 5');
  fs.writeFileSync('db_output.json', JSON.stringify(rows, null, 2));
  connection.end();
}
run();
