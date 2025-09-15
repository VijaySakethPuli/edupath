const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    name: { type: String, required: true },
    class: { type: Number, required: true },
    board: { type: String, enum: ['CBSE', 'ICSE', 'State Board'], default: 'CBSE' },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: [Number] // [longitude, latitude]
    },
    languages: [String],
    interests: [String],
    constraints: {
      budget: Number,
      commuteRadius: { type: Number, default: 50 } // km
    }
  },
  assessments: {
    interests: {
      realistic: Number,
      investigative: Number,
      artistic: Number,
      social: Number,
      enterprising: Number,
      conventional: Number,
      completedAt: Date
    },
    aptitude: {
      logical: Number,
      numerical: Number,
      spatial: Number,
      verbal: Number,
      completedAt: Date
    },
    personality: {
      openness: Number,
      conscientiousness: Number,
      extraversion: Number,
      agreeableness: Number,
      neuroticism: Number,
      completedAt: Date
    }
  },
  recommendations: [{
    type: { type: String, enum: ['stream', 'career', 'college'] },
    item: String,
    score: Number,
    reasons: [String],
    timestamp: { type: Date, default: Date.now }
  }],
  engagement: {
    streak: { type: Number, default: 0 },
    lastActive: Date,
    completedModules: [String],
    badges: [String]
  },
  parentConsent: {
    given: { type: Boolean, default: false },
    parentEmail: String,
    timestamp: Date
  }
}, {
  timestamps: true
});

// Geospatial index for location-based queries
userSchema.index({ "profile.location": "2dsphere" });

module.exports = mongoose.model('User', userSchema);