const Workout = require('../models/Workout');

const getStreak = async (req, res) => {
  try {
    const userId = req.user._id;
    const workouts = await Workout.find({ user: userId }).sort({ date: 1 });

    if (workouts.length === 0) return res.json({ streak: 0 });

    // Extract unique workout days (yyyy-mm-dd)
    const daysWithWorkouts = [...new Set(workouts.map(w => w.date.toISOString().split('T')[0]))];

    // Calculate streak backwards from today
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0,0,0,0); // normalize to start of day

    for (let i = daysWithWorkouts.length - 1; i >= 0; i--) {
      const day = new Date(daysWithWorkouts[i]);
      day.setHours(0,0,0,0);

      if ((currentDate - day) / (1000 * 60 * 60 * 24) === streak) {
        streak++;
      } else if ((currentDate - day) / (1000 * 60 * 60 * 24) > streak) {
        break;
      }
    }

    res.json({ streak });

  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

module.exports = { getStreak };
