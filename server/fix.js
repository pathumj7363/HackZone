import db from './database/db.js'; db.query('UPDATE teams SET inviteCode = \'HZ-DARKW\' WHERE name = \'Dark-warriors\'').then(() => {console.log('Updated'); process.exit(0)});
