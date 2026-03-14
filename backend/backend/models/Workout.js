const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  exercises: [
    {
      name: { type: String, required: true },
      sets: Number,
      reps: Number,
      weight: Number,
    }
  ],
  date: { type: Date, default: Date.now },
  scheduledTime: { type: Date, default: null },
  reminderEnabled: { type: Boolean, default: false }, 
  caloriesBurned: Number, // 🔥 new
  durationInMinutes: Number, // 🕒 new
}, { timestamps: true });


module.exports = mongoose.model('Workout', workoutSchema);
