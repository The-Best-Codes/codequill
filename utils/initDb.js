import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

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

//console.info('Database initialized');

export default async function initDb() {
    if (!fs.existsSync(path.join(process.cwd(), "database.sqlite"))) {
        // Create the database file
        fs.writeFileSync(path.join(process.cwd(), "database.sqlite"), "");
    }
}