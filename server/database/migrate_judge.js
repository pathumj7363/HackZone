import pool from './db.js';

const migrateJudgePhase1 = async () => {
  try {
    console.log("Running Phase 1 Migrations...");

    // 1. Extend users table for Judge specific fields
    // Using IF NOT EXISTS logic via catch if column exists is tricky in mysql2, 
    // we'll just try to add them and catch duplicate column errors.
    const addColumnsQueries = [
      "ALTER TABLE users ADD COLUMN occupation VARCHAR(255);",
      "ALTER TABLE users ADD COLUMN expertiseTags JSON;",
      "ALTER TABLE users ADD COLUMN linkedInUrl VARCHAR(255);"
    ];

    for (let q of addColumnsQueries) {
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

    // 2. Create evaluations table
    const createEvaluationsQuery = `
      CREATE TABLE IF NOT EXISTS evaluations (
        id VARCHAR(255) PRIMARY KEY,
        submissionId VARCHAR(255) NOT NULL,
        judgeId VARCHAR(255) NOT NULL,
        hackathonId VARCHAR(255) NOT NULL,
        innovationScore INT CHECK (innovationScore BETWEEN 1 AND 10),
        technicalComplexityScore INT CHECK (technicalComplexityScore BETWEEN 1 AND 10),
        designScore INT CHECK (designScore BETWEEN 1 AND 10),
        usabilityScore INT CHECK (usabilityScore BETWEEN 1 AND 10),
        feedback TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_evaluation (submissionId, judgeId)
      )
    `;
    await pool.query(createEvaluationsQuery);
    console.log("✅ Evaluations table initialized successfully!");

    console.log("Phase 1 Migrations Complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during migration:", error);
    process.exit(1);
  }
};

migrateJudgePhase1();
