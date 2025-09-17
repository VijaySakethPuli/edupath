// backend/routes/recommendations.js
const express = require('express');
const axios = require('axios');

const router = express.Router();

// Optional: read AI service URL from env (e.g., http://localhost:8000)
const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'recommendations routes ok', ai_url: AI_URL });
});

// Utility: safe call to AI service with graceful fallback
async function callAI(endpoint, payload, fallbackFn) {
  try {
    const { data } = await axios.post(`${AI_URL}${endpoint}`, payload, {
      timeout: 5000,
    });
    return data;
  } catch (err) {
    console.warn(`AI service unavailable for ${endpoint}. Using fallback.`, err?.message);
    return fallbackFn(payload);
  }
}

/* ---------- STREAM RECOMMENDATIONS ---------- */
router.post('/streams', async (req, res) => {
  const {
    interests = {},
    aptitude = null,
    class_level = 10
  } = req.body || {};

  const payload = {
    profile: { interests, aptitude, class_level },
    recommendation_type: 'stream'
  };

  const fallback = ({ profile }) => {
    const i = profile?.interests || {};
    const a = profile?.aptitude || {};

    const sciScore =
      (i.investigative || 0) * 0.6 +
      (i.realistic || 0) * 0.4 +
      ((a.logical || 0) + (a.numerical || 0)) * 0.3;

    const comScore =
      (i.enterprising || 0) * 0.6 +
      (i.conventional || 0) * 0.4 +
      ((a.numerical || 0) + (a.verbal || 0)) * 0.25;

    const artsScore =
      (i.social || 0) * 0.5 +
      (i.artistic || 0) * 0.5 +
      (a.verbal || 0) * 0.2;

    const pack = (name, score, reasons) => ({
      stream: name,
      fit_score: Math.round(Math.min(100, score / 2)),
      reasons
    });

    const recs = [
      pack('Science', sciScore, [
        i.investigative > 60 ? 'High investigative interest' : null,
        i.realistic > 60 ? 'Strong realistic inclination' : null,
        a.logical > 70 && a.numerical > 70 ? 'Good logical and numerical aptitude' : null
      ].filter(Boolean)),
      pack('Commerce', comScore, [
        i.enterprising > 60 ? 'Strong enterprising interest' : null,
        i.conventional > 60 ? 'Organized and detail-oriented' : null,
        a.numerical > 65 ? 'Good with numbers' : null
      ].filter(Boolean)),
      pack('Arts', artsScore, [
        i.artistic > 60 ? 'High artistic orientation' : null,
        i.social > 60 ? 'People-focused interests' : null,
        a.verbal > 70 ? 'Strong verbal aptitude' : null
      ].filter(Boolean))
    ].sort((a, b) => b.fit_score - a.fit_score);

    return { recommendations: recs };
  };

  const result = await callAI('/recommend/streams', payload, fallback);
  return res.json(result);
});

/* ---------- CAREER RECOMMENDATIONS ---------- */
router.post('/careers', async (req, res) => {
  const {
    interests = {},
    aptitude = null,
    personality = null,
    class_level = 10
  } = req.body || {};

  const payload = {
    profile: { interests, aptitude, personality, class_level },
    recommendation_type: 'career'
  };

  const fallback = ({ profile }) => {
    const i = profile?.interests || {};
    const a = profile?.aptitude || {};

    const candidates = [
      {
        id: 'software_engineer',
        name: 'Software Engineer',
        score:
          (i.investigative || 0) * 0.6 +
          (a.logical || 0) * 0.5 +
          (a.numerical || 0) * 0.3
      },
      {
        id: 'data_scientist',
        name: 'Data Scientist',
        score:
          (i.investigative || 0) * 0.7 +
          (a.numerical || 0) * 0.6 +
          (a.logical || 0) * 0.4
      },
      {
        id: 'graphic_designer',
        name: 'Graphic Designer',
        score:
          (i.artistic || 0) * 0.8 +
          (a.spatial || 0) * 0.5 +
          (i.enterprising || 0) * 0.2
      },
      {
        id: 'teacher',
        name: 'Teacher',
        score:
          (i.social || 0) * 0.8 +
          (a.verbal || 0) * 0.6
      },
      {
        id: 'business_analyst',
        name: 'Business Analyst',
        score:
          (i.enterprising || 0) * 0.6 +
          (i.investigative || 0) * 0.4 +
          (a.numerical || 0) * 0.5 +
          (a.verbal || 0) * 0.4
      }
    ]
      .map(c => ({
        career: { id: c.id, name: c.name },
        fit_score: Math.round(Math.min(100, c.score / 2)),
        reasons: []
      }))
      .sort((a, b) => b.fit_score - a.fit_score)
      .slice(0, 10);

    return { recommendations: candidates };
  };

  const result = await callAI('/recommend/careers', payload, fallback);
  return res.json(result);
});

module.exports = router;