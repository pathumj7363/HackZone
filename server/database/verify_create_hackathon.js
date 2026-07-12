import pool from './db.js';
import { createHackathon, getHackathonById } from '../models/hackathon.model.js';

const verifyCreateHackathon = async () => {
  try {
    console.log("Starting manual verification for createHackathon query...");

    const dummyHackathon = {
      id: "hack_test_123",
      title: "Test Hackathon",
      description: "A hackathon for verification",
      startDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
      endDate: new Date(Date.now() + 86400000).toISOString().slice(0, 19).replace('T', ' '),
      rules: "No rules",
      prizes: [{ title: "1st Place", amount: "$1000" }],
      sponsors: ["TestCorp"],
      judges: ["judge1"],
      organizerId: "org_test_123"
    };

    console.log("Creating hackathon...");
    await createHackathon(dummyHackathon);
    console.log("✅ createHackathon executed successfully.");

    console.log("Fetching created hackathon...");
    const created = await getHackathonById("hack_test_123");
    
    if (created && created.title === "Test Hackathon") {
      console.log("✅ Hackathon verified in database.");
      console.log("Created Hackathon Data:", created);
    } else {
      console.error("❌ Hackathon data mismatch or not found.");
    }

    // Clean up
    console.log("Cleaning up test data...");
    await pool.query("DELETE FROM hackathons WHERE id = ?", ["hack_test_123"]);
    console.log("✅ Cleanup complete.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error during verification:", error);
    process.exit(1);
  }
};

verifyCreateHackathon();
