// backend/routes/colleges.js
const express = require('express');
const router = express.Router();
// If you already have auth middleware and College model, uncomment these:
// const auth = require('../middleware/auth');
// const College = require('../models/College');

// Health check for this route group
router.get('/health', (req, res) => {
  res.json({ status: 'colleges routes ok' });
});

// Minimal search stub (no DB yet). Replace with real query later.
// Example protected route: add `auth` as first arg if you enable JWT.
// router.post('/search', auth, async (req, res) => { ... })
router.post('/search', async (req, res) => {
  try {
    const { location = '', radius = 50, course = '', maxFees = 100000 } = req.body || {};
    // Return an empty, well-formed payload so the frontend doesn’t break
    res.json({
      filters: { location, radius, course, maxFees },
      colleges: [],
      total: 0
    });
  } catch (e) {
    console.error('College search error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;