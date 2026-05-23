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
      notify_count INTEGER DEFAULT 3,
      reminders_left INTEGER DEFAULT 3,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Migrations for existing databases
    db.run(`ALTER TABLE activities ADD COLUMN notify_count INTEGER DEFAULT 3`, (err) => {
      // Ignore if column already exists
    });
    db.run(`ALTER TABLE activities ADD COLUMN reminders_left INTEGER DEFAULT 3`, (err) => {
      // Ignore if column already exists
    });

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
