import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import db from './database.js';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_key';

// Middleware to verify JWT
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Signup logic
export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = crypto.randomUUID();

  db.run(
    'INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)',
    [userId, email, hashedPassword, name],
    function(err) {
      if (err) {
        return res.status(400).json({ error: 'User already exists' });
      }
      
      // Initialize default settings
      db.run('INSERT INTO settings (user_id, primaryColor, calendarColor, popupCharacter, showNotification) VALUES (?, ?, ?, ?, ?)', 
        [userId, '#6366f1', '#6366f1', 'hellokitty', 0]);

      const token = jwt.sign({ id: userId, email, name }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: userId, email, name } });
    }
  );
};

// Login logic
export const login = async (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user || !user.password) {
      return res.status(400).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, photo: user.photo } });
  });
};

// Google Login logic
export const googleLogin = async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture: photo } = payload;

    db.get('SELECT * FROM users WHERE google_id = ? OR email = ?', [googleId, email], (err, user) => {
      if (user) {
        // User exists, update google_id if not set
        if (!user.google_id) {
          db.run('UPDATE users SET google_id = ?, photo = ? WHERE id = ?', [googleId, photo, user.id]);
        }
        const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
        return res.json({ token, user: { id: user.id, email: user.email, name: user.name, photo: user.photo || photo } });
      } else {
        // Create new user
        const userId = crypto.randomUUID();
        db.run(
          'INSERT INTO users (id, email, name, photo, google_id) VALUES (?, ?, ?, ?, ?)',
          [userId, email, name, photo, googleId],
          function(err) {
            if (err) return res.status(500).json({ error: 'Error creating user' });
            
            db.run('INSERT INTO settings (user_id, primaryColor, calendarColor, popupCharacter, showNotification) VALUES (?, ?, ?, ?, ?)', 
              [userId, '#6366f1', '#6366f1', 'hellokitty', 0]);

            const token = jwt.sign({ id: userId, email, name }, JWT_SECRET, { expiresIn: '7d' });
            res.json({ token, user: { id: userId, email, name, photo } });
          }
        );
      }
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid Google token' });
  }
};
