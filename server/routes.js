import express from 'express';
import db from './database.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Activities
router.get('/activities', authenticateToken, (req, res) => {
  db.all('SELECT * FROM activities WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/activities', authenticateToken, (req, res) => {
  const { id, title, description, date, time, status, character_id } = req.body;
  db.run(
    'INSERT INTO activities (id, user_id, title, description, date, time, status, character_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, req.user.id, title, description, date, time, status, character_id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, title, description, date, time, status, character_id });
    }
  );
});

router.put('/activities/:id', authenticateToken, (req, res) => {
  const { title, description, date, time, status, character_id } = req.body;
  db.run(
    'UPDATE activities SET title = ?, description = ?, date = ?, time = ?, status = ?, character_id = ? WHERE id = ? AND user_id = ?',
    [title, description, date, time, status, character_id, req.params.id, req.user.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Updated successfully' });
    }
  );
});

router.delete('/activities/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM activities WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Deleted successfully' });
  });
});

// Settings
router.get('/settings', authenticateToken, (req, res) => {
  db.get('SELECT * FROM settings WHERE user_id = ?', [req.user.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row || {});
  });
});

router.put('/settings', authenticateToken, (req, res) => {
  const { logo, primaryColor, calendarColor, popupCharacter, showNotification } = req.body;
  db.run(
    'INSERT INTO settings (user_id, logo, primaryColor, calendarColor, popupCharacter, showNotification) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET logo=excluded.logo, primaryColor=excluded.primaryColor, calendarColor=excluded.calendarColor, popupCharacter=excluded.popupCharacter, showNotification=excluded.showNotification',
    [req.user.id, logo, primaryColor, calendarColor, popupCharacter, showNotification ? 1 : 0],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Settings updated successfully' });
    }
  );
});

export default router;
