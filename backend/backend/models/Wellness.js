const mongoose = require('mongoose');

// Sleep tracking
const sleepSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  hoursSlept: { type: Number, required: true },
  quality: { type: Number, required: true, min: 1, max: 5 },
  notes: { type: String }
}, { timestamps: true });

// Mood tracking
const moodSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  moodRating: { type: Number, required: true, min: 1, max: 5 },
  energyLevel: { type: Number, required: true, min: 1, max: 5 },
  stressLevel: { type: Number, required: true, min: 1, max: 5 },
  notes: { type: String }
}, { timestamps: true });

// Meditation tracking
const meditationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  duration: { type: Number, required: true }, // in minutes
  type: { type: String, required: true },
  notes: { type: String }
}, { timestamps: true });

// Create indexes
sleepSchema.index({ user: 1, date: 1 }, { unique: true });
moodSchema.index({ user: 1, date: 1 }, { unique: true });
meditationSchema.index({ user: 1, date: 1 });

// Export models
const Sleep = mongoose.model('Sleep', sleepSchema);
const Mood = mongoose.model('Mood', moodSchema);
const Meditation = mongoose.model('Meditation', meditationSchema);

module.exports = {
  Sleep,
  Mood,
  Meditation
};
