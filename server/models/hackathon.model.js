import pool from '../database/db.js';

export const createHackathon = async (id, title, description, startDate, endDate) => {
  const query = `
    INSERT INTO hackathons (id, title, description, startDate, endDate, status)
    VALUES (?, ?, ?, ?, ?, 'draft')
  `;
  await pool.query(query, [id, title, description, startDate, endDate]);
  return { id, title, description, startDate, endDate, status: 'draft' };
};

export const getAllHackathons = async () => {
  const query = `SELECT * FROM hackathons ORDER BY created_at DESC`;
  const [rows] = await pool.query(query);
  return rows;
};

export const getHackathonById = async (id) => {
  const query = `SELECT * FROM hackathons WHERE id = ?`;
  const [rows] = await pool.query(query, [id]);
  return rows.length ? rows[0] : null;
};
