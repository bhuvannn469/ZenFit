const Workout = require('../models/Workout');

// @desc Get summary stats
// @route GET /api/stats/summary
// @access Private
const getSummaryStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const workouts = await Workout.find({ user: userId });

    const totalWorkouts = workouts.length;
    const totalCalories = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
    const totalDuration = workouts.reduce((sum, w) => sum + (w.durationInMinutes || 0), 0);

    res.json({
      totalWorkouts,
      totalCalories,
      totalDuration
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

const getWeeklyStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // include today

    const workouts = await Workout.find({
      user: userId,
      date: { $gte: sevenDaysAgo }
    });

    // Group by date (YYYY-MM-DD)
    const statsMap = {};

    workouts.forEach(workout => {
      const date = workout.date.toISOString().split('T')[0];

      if (!statsMap[date]) {
        statsMap[date] = { date, calories: 0, duration: 0 };
      }

      statsMap[date].calories += workout.caloriesBurned || 0;
      statsMap[date].duration += workout.durationInMinutes || 0;
    });

    // Fill missing days with 0s
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];

      result.push(statsMap[key] || { date: key, calories: 0, duration: 0 });
    }

    res.json(result);

  } catch (error) {
    console.error("Weekly Stats Error:", error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};


module.exports = { getSummaryStats, getWeeklyStats };
