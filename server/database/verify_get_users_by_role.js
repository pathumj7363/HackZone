import pool from './db.js';
import { createUser, getUsersByRole } from '../models/user.model.js';

const verifyGetUsersByRole = async () => {
  try {
    console.log("Starting manual verification for getUsersByRole query...");

    const judgeId1 = "judge_test_1";
    const judgeId2 = "judge_test_2";
    
    console.log("Creating dummy judges...");
    await createUser(judgeId1, "Test Judge 1", "judge1@test.com", "hash123", "judge");
    await createUser(judgeId2, "Test Judge 2", "judge2@test.com", "hash123", "judge");
    console.log("✅ Dummy judges created.");

    console.log("Fetching users by role 'judge'...");
    const judges = await getUsersByRole("judge");
    
    const fetchedJudge1 = judges.find(j => j.id === judgeId1);
    const fetchedJudge2 = judges.find(j => j.id === judgeId2);

    if (fetchedJudge1 && fetchedJudge2) {
      console.log("✅ getUsersByRole successfully retrieved the correct users.");
      console.log(`Found ${judges.length} total judges in database.`);
    } else {
      console.error("❌ Failed to retrieve the newly created judges.");
    }

    // Clean up
    console.log("Cleaning up test data...");
    await pool.query("DELETE FROM users WHERE id IN (?, ?)", [judgeId1, judgeId2]);
    console.log("✅ Cleanup complete.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error during verification:", error);
    process.exit(1);
  }
};

verifyGetUsersByRole();
