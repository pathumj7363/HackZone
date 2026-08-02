import pool from '../database/db.js';

// Auto-migrate new table
(async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(255) PRIMARY KEY,
        userId VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        link VARCHAR(255),
        isRead BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    await pool.query(createTableQuery);
    console.log("✅ Verified notifications table");
  } catch (err) {
    console.error("Error creating notifications table:", err);
  }
})();

export const createNotification = async (notificationData) => {
  const { id, userId, title, message, type, link } = notificationData;
  const query = `
    INSERT INTO notifications (id, userId, title, message, type, link)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  await pool.query(query, [id, userId, title, message, type || 'info', link || null]);
  return notificationData;
};

export const getNotificationsByUserId = async (userId) => {
  const query = `
    SELECT * FROM notifications 
    WHERE userId = ? 
    ORDER BY created_at DESC 
    LIMIT 50
  `;
  const [rows] = await pool.query(query, [userId]);
  return rows;
};

export const markNotificationAsRead = async (id, userId) => {
  const query = `
    UPDATE notifications 
    SET isRead = TRUE 
    WHERE id = ? AND userId = ?
  `;
  const [result] = await pool.query(query, [id, userId]);
  return result.affectedRows > 0;
};

export const markAllNotificationsAsRead = async (userId) => {
  const query = `
    UPDATE notifications 
    SET isRead = TRUE 
    WHERE userId = ? AND isRead = FALSE
  `;
  const [result] = await pool.query(query, [userId]);
  return result.affectedRows;
};
