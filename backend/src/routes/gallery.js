const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Gallery } = require('../models');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WEBP)'));
    }
  }
});

// Create gallery entry (admin only)
router.post('/', authenticate, requireAdmin, upload.single('photo'), async (req, res) => {
  try {
    const { description, date_added } = req.body;
    
    if (!req.file || !date_added) {
      return res.status(400).json({ error: 'photo and date_added are required' });
    }

    // Store relative path to the uploaded file
    const imagePath = `/uploads/${req.file.filename}`;

    const entry = await Gallery.create({
      image: imagePath,
      description: description || null,
      date_added
    });

    res.status(201).json({
      success: true,
      message: 'Gallery entry created successfully',
      entry
    });
  } catch (err) {
    console.error('Gallery creation error:', err);
    // Delete uploaded file if DB operation fails
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting file:', unlinkErr);
      });
    }
    res.status(400).json({ error: err.message || 'Error creating gallery entry' });
  }
});

// Get all gallery entries
router.get('/', async (req, res) => {
  try {
    // Order by primary key to avoid issues with timestamp column naming
    const entries = await Gallery.findAll({
      order: [['gallery_id', 'DESC']]
    });
    res.json(entries);
  } catch (err) {
    console.error('Error fetching gallery:', err);
    res.status(400).json({ error: err.message });
  }
});

// Delete gallery entry (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const entry = await Gallery.findByPk(req.params.id);
    if (!entry) {
      return res.status(404).json({ error: 'Gallery entry not found' });
    }
    
    // Delete the physical file if it exists
    if (entry.image && entry.image.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '../../uploads', path.basename(entry.image));
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    await entry.destroy();
    res.json({ success: true, message: 'Gallery entry deleted' });
  } catch (err) {
    console.error('Error deleting gallery:', err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
