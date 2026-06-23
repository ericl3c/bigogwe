const express = require('express');
const router = express.Router();
const { Contact } = require('../models');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.post('/', async (req, res) => {
  try {
    const {
      fullname,
      email_address,
      phone_number,
      subject,
      message,
    } = req.body;

    if (!fullname || !email_address || !subject || !message) {
      return res.status(400).json({
        error: 'Full name, email address, subject, and message are required',
      });
    }

    const c = await Contact.create({
      fullname: String(fullname).trim(),
      email_address: String(email_address).trim(),
      phone_number: phone_number ? String(phone_number).trim() : null,
      subject: String(subject).trim(),
      message: String(message).trim(),
    });

    res.status(201).json({ success: true, contact: c });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const items = await Contact.findAll({
      order: [['contact_id', 'DESC']],
    });
    res.json(items);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const item = await Contact.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Message not found' });
    }

    await item.destroy();
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
