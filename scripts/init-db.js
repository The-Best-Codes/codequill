const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const fs = require('fs');
const path = require('path');

if (!fs.existsSync('./database.sqlite')) {
  fs.writeFileSync('./database.sqlite', '');
}

(async () => {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      code TEXT,
      language TEXT,
      metadata JSON
    )
  `);

  console.log('Database initialized');
})();
