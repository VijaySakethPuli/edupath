const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: 'text'
  },
  type: {
    type: String,
    enum: ['Government', 'Government Aided', 'Private'],
    default: 'Government'
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number], // [longitude, latitude]
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  courses: [{
    name: String,
    degree: { type: String, enum: ['BA', 'BSc', 'BCom', 'BBA', 'BCA', 'Other'] },
    duration: Number, // years
    fees: {
      annual: Number,
      total: Number
    },
    seats: {
      total: Number,
      available: Number
    },
    eligibility: {
      minimumMarks: Number,
      subjects: [String],
      entrance: String
    },
    cutoffs: [{
      year: Number,
      category: String,
      marks: Number
    }]
  }],
  facilities: [{
    type: String,
    enum: ['Hostel', 'Library', 'Lab', 'Sports', 'Canteen', 'WiFi', 'Transport']
  }],
  contact: {
    phone: String,
    email: String,
    website: String
  },
  rankings: {
    nirf: Number,
    placementRate: Number,
    averagePackage: Number
  },
  accreditation: {
    naac: String,
    ugc: Boolean
  }
}, {
  timestamps: true
});

// Geospatial index for location-based search
collegeSchema.index({ "location": "2dsphere" });
collegeSchema.index({ "name": "text", "location.city": "text" });

module.exports = mongoose.model('College', collegeSchema);