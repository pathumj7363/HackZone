import pool from './database/db.js';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runMigrations = async () => {
  const scripts = [
    'database/init.js',
    'database/migrate_participant.js',
    'database/migrate_organizer.js',
    'database/migrate_judge.js',
    'database/migrate_avatar.js',
    'database/add_columns.js',
    'database/migrate_dynamic_scores.js',
    'database/migrate_indexes.js'
  ];

  console.log("🚀 Starting database setup on Aiven...");

  for (const script of scripts) {
    try {
      console.log(`\n▶️ Running ${script}...`);
      // Run each script synchronously
      execSync(`node ${path.join(__dirname, script)}`, { stdio: 'inherit' });
    } catch (err) {
      console.error(`❌ Failed to run ${script}. Error:`, err.message);
    }
  }

  console.log("\n✅ All database migrations finished!");
  process.exit(0);
};

runMigrations();
