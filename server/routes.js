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
  const { id, title, description, date, time, status, character_id, characterId, notify_count, notifyCount, reminders_left, remindersLeft } = req.body;
  const dbCharId = character_id || characterId;
  const dbNotifyCount = notify_count !== undefined ? notify_count : (notifyCount !== undefined ? notifyCount : 3);
  const dbRemindersLeft = reminders_left !== undefined ? reminders_left : (remindersLeft !== undefined ? remindersLeft : dbNotifyCount);

  db.run(
    'INSERT INTO activities (id, user_id, title, description, date, time, status, character_id, notify_count, reminders_left) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, req.user.id, title, description, date, time, status, dbCharId, dbNotifyCount, dbRemindersLeft],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, title, description, date, time, status, character_id: dbCharId, notify_count: dbNotifyCount, reminders_left: dbRemindersLeft });
    }
  );
});

router.put('/activities/:id', authenticateToken, (req, res) => {
  const { title, description, date, time, status, character_id, characterId, notify_count, notifyCount, reminders_left, remindersLeft } = req.body;
  const dbCharId = character_id || characterId;
  const dbNotifyCount = notify_count !== undefined ? notify_count : (notifyCount !== undefined ? notifyCount : 3);
  const dbRemindersLeft = reminders_left !== undefined ? reminders_left : (remindersLeft !== undefined ? remindersLeft : dbNotifyCount);

  db.run(
    'UPDATE activities SET title = ?, description = ?, date = ?, time = ?, status = ?, character_id = ?, notify_count = ?, reminders_left = ? WHERE id = ? AND user_id = ?',
    [title, description, date, time, status, dbCharId, dbNotifyCount, dbRemindersLeft, req.params.id, req.user.id],
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

    if (row) {
      // Existing settings — return as-is
      return res.json(row);
    }

    // New user — insert defaults (pink + hellokitty) and return them
    const defaults = {
      user_id:        req.user.id,
      logo:           null,
      primaryColor:   '#f787bf',
      calendarColor:  '#f787bf',
      popupCharacter: 'hellokitty',
      showNotification: 0
    };

    db.run(
      `INSERT INTO settings (user_id, logo, primaryColor, calendarColor, popupCharacter, showNotification)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [defaults.user_id, defaults.logo, defaults.primaryColor, defaults.calendarColor, defaults.popupCharacter, defaults.showNotification],
      function (insertErr) {
        if (insertErr) {
          // If insert fails, just return the in-memory defaults so the UI still works
          console.error('Error creating default settings:', insertErr.message);
          return res.json(defaults);
        }
        res.json(defaults);
      }
    );
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
