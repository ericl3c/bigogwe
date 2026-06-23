const express = require('express');
const router = express.Router();
const { Service } = require('../models');

// List services
router.get('/', async (req, res) => {
  const services = await Service.findAll();
  res.json(services);
});

// Get service
router.get('/:id', async (req, res) => {
  const service = await Service.findByPk(req.params.id);
  if (!service) return res.status(404).json({ error: 'Not found' });
  res.json(service);
});

// Admin create/update/delete would be added here with auth

module.exports = router;
