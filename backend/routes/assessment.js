const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'assessment routes ok' });
});

module.exports = router;

const Assessment = require('../models/Assessment');

router.post('/submit', async (req, res) => {
  try {
    const { interests, aptitude, scores, userId } = req.body;
    const assessment = await Assessment.create({
      userId: userId || null,
      interests,
      aptitude,
      scores,
      createdAt: new Date(),
    });
    res.json({ ok: true, assessmentId: assessment._id });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;

const path = require('path');
console.log('Assess path exists?', require('fs').existsSync(path.join(__dirname, '../models/Assessment.js')));