import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    createTables();
  }
});

function createTables() {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      password TEXT,
      name TEXT,
      photo TEXT,
      google_id TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Activities table
    db.run(`CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      title TEXT,
      description TEXT,
      date TEXT,
      time TEXT,
      status TEXT,
      character_id TEXT,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Settings table
    db.run(`CREATE TABLE IF NOT EXISTS settings (
      user_id TEXT PRIMARY KEY,
      logo TEXT,
      primaryColor TEXT,
      calendarColor TEXT,
      popupCharacter TEXT,
      showNotification INTEGER,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);
  });
}

export default db;
