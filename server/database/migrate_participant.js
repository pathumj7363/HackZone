import pool from './db.js';

const migrateParticipantPhase = async () => {
  try {
    console.log("Running Participant Migrations...");

    // 1. Extend users table for participant fields
    const addColumnsQueries = [
      "ALTER TABLE users ADD COLUMN skills JSON;",
      "ALTER TABLE users ADD COLUMN githubUrl VARCHAR(255);",
      "ALTER TABLE users ADD COLUMN bio TEXT;"
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

    // 2. Create hackathons table
    const createHackathonsQuery = `
      CREATE TABLE IF NOT EXISTS hackathons (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        startDate DATETIME,
        endDate DATETIME,
        status VARCHAR(50) DEFAULT 'draft',
        organizerId VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(createHackathonsQuery);
    console.log("✅ Hackathons table initialized successfully!");

    // 3. Create teams table
    const createTeamsQuery = `
      CREATE TABLE IF NOT EXISTS teams (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        leaderId VARCHAR(255) NOT NULL,
        hackathonId VARCHAR(255) NOT NULL,
        maxCapacity INT DEFAULT 4,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(createTeamsQuery);
    console.log("✅ Teams table initialized successfully!");

    // 4. Create team_members table
    const createTeamMembersQuery = `
      CREATE TABLE IF NOT EXISTS team_members (
        teamId VARCHAR(255) NOT NULL,
        userId VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'member',
        UNIQUE KEY unique_team_user (teamId, userId)
      )
    `;
    await pool.query(createTeamMembersQuery);
    console.log("✅ Team Members table initialized successfully!");

    // 5. Create team_invites table
    const createTeamInvitesQuery = `
      CREATE TABLE IF NOT EXISTS team_invites (
        id VARCHAR(255) PRIMARY KEY,
        teamId VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(createTeamInvitesQuery);
    console.log("✅ Team Invites table initialized successfully!");

    // 6. Create submissions table
    const createSubmissionsQuery = `
      CREATE TABLE IF NOT EXISTS submissions (
        id VARCHAR(255) PRIMARY KEY,
        teamId VARCHAR(255) NOT NULL,
        hackathonId VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        githubRepo VARCHAR(255),
        demoVideoUrl VARCHAR(255),
        averageScore FLOAT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(createSubmissionsQuery);
    console.log("✅ Submissions table initialized successfully!");

    console.log("Participant Migrations Complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during migration:", error);
    process.exit(1);
  }
};

migrateParticipantPhase();
