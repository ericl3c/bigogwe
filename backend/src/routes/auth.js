const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Register (public)
router.post('/register', async (req, res) => {
  try {
    const { name_user, email, password, role } = req.body;

    if (!name_user || !email || !password) {
      return res.status(400).json({ error: 'name_user, email, and password are required' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name_user,
      email,
      password: hash,
      role: role || 'Tour_Guide'
    });
    res.status(201).json({
      id: user.id,
      email: user.email,
      name_user: user.name_user,
      role: user.role
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Register admin/developer (first CEO is public; later CEOs require existing CEO auth)
router.post('/register-admin', async (req, res) => {
  try {
    const { name_user, email, password } = req.body;

    if (!name_user || !email || !password) {
      return res.status(400).json({ error: 'name_user, email, and password are required' });
    }

    const existingCeo = await User.findOne({ where: { role: 'ceo' } });
    if (existingCeo) {
      const header = req.headers.authorization;
      if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const token = header.slice(7);
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      } catch {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      if (decoded.role !== 'ceo') {
        return res.status(403).json({ error: 'Admin access required' });
      }
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name_user,
      email,
      password: hash,
      role: 'ceo',
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
      name_user: user.name_user,
      role: user.role,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, email: user.email, name_user: user.name_user, role: user.role } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin existence status
router.get('/admin-status', async (req, res) => {
  try {
    const count = await User.count({ where: { role: 'ceo' } });
    res.json({ hasAdmin: count > 0 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to evaluate admin status' });
  }
});

module.exports = router;

