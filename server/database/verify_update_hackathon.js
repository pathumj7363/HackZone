import pool from './db.js';
import { createHackathon, getHackathonById, updateHackathon } from '../models/hackathon.model.js';

const verifyUpdateHackathon = async () => {
  try {
    console.log("Starting manual verification for updateHackathon query...");

    const dummyId = "hack_update_test_123";
    const initialHackathon = {
      id: dummyId,
      title: "Initial Title",
      description: "Initial description",
      startDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
      endDate: new Date(Date.now() + 86400000).toISOString().slice(0, 19).replace('T', ' '),
      rules: "Initial rules",
      prizes: [{ title: "1st Place", amount: "$100" }],
      sponsors: ["TestCorp"],
      judges: ["judge1"],
      organizerId: "org_test_123"
    };

    console.log("1. Creating initial hackathon...");
    await createHackathon(initialHackathon);

    console.log("2. Updating hackathon (partial update)...");
    const updateData = {
      title: "Updated Title",
      status: "published",
      prizes: [{ title: "1st Place", amount: "$5000" }]
    };
    
    const isUpdated = await updateHackathon(dummyId, updateData);
    if (!isUpdated) {
      throw new Error("updateHackathon returned false.");
    }
    console.log("✅ updateHackathon executed successfully.");

    console.log("3. Fetching updated hackathon...");
    const fetched = await getHackathonById(dummyId);
    
    if (fetched && fetched.title === "Updated Title" && fetched.status === "published") {
      console.log("✅ Partial update verified successfully. Unchanged fields were preserved.");
      console.log("Updated Data:", {
        title: fetched.title,
        status: fetched.status,
        prizes: fetched.prizes,
        description: fetched.description // Should still be "Initial description"
      });
    } else {
      console.error("❌ Hackathon update verification failed.");
      console.error("Fetched:", fetched);
    }

    // Clean up
    console.log("Cleaning up test data...");
    await pool.query("DELETE FROM hackathons WHERE id = ?", [dummyId]);
    console.log("✅ Cleanup complete.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error during verification:", error);
    process.exit(1);
  }
};

verifyUpdateHackathon();
