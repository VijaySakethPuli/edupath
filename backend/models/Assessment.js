// backend/models/Assessment.js
const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    interests: { type: Map, of: Number, default: {} }, // e.g., {I1: 4}
    aptitude: { type: Map, of: Number, default: {} },  // e.g., {'0': 1}
    scores: {
      interestPct: { type: Number, default: 0 },
      aptitudePct: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assessment', AssessmentSchema);