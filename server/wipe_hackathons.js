import pool from './database/db.js';

(async () => {
  try {
    console.log("Connecting to Aiven Database...");
    
    // Disable foreign key checks temporarily if needed, though CASCADE should handle it.
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    
    console.log("Deleting all records from hackathons table...");
    const [result] = await pool.query('DELETE FROM hackathons');
    console.log(`Deleted ${result.affectedRows} hackathons.`);
    
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log("✅ Database wiped successfully. Ready for full flow test.");
  } catch (err) {
    console.error("❌ Error wiping database:", err);
  } finally {
    process.exit(0);
  }
})();
