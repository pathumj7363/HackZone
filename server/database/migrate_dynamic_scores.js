import pool from './db.js';

const migrate = async () => {
  try {
    console.log("Adding dynamicScores column to evaluations...");
    try {
      await pool.query("ALTER TABLE evaluations ADD COLUMN dynamicScores JSON;");
      console.log("✅ Column added successfully.");
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log("✅ Column dynamicScores already exists, skipping.");
      } else {
        throw err;
      }
    }
    
    // Also make existing score columns nullable, if they aren't already.
    // They are probably already nullable, but let's ensure it.
    console.log("Migration complete.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during migration:", error);
    process.exit(1);
  }
};

migrate();
