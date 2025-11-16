// backend/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { db } = require('../db');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM Users WHERE username = ?", [username], (err, user) => {
    if (err || !user) return res.status(401).json({ message: 'Invalid credentials' });
    if (!bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, 'secretkey', { expiresIn: '1h' });
    res.json({ token });
  });
});

module.exports = router;