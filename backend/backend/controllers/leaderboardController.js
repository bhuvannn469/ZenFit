const Workout = require('../models/Workout');
const User = require('../models/User');

const getLeaderboard = async (req, res) => {
  try {
    // Aggregate total calories burned by user or total workouts count
    const leaderboard = await Workout.aggregate([
      {
        $group: {
          _id: '$user',
          totalCalories: { $sum: '$caloriesBurned' }, // or count workouts: $sum: 1
          totalWorkouts: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $sort: { totalCalories: -1 } }, // Sort by calories desc
      { $limit: 10 }, // top 10
      {
        $project: {
          _id: 0,
          userId: '$user._id',
          name: '$user.name',
          totalCalories: 1,
          totalWorkouts: 1
        }
      }
    ]);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

module.exports = { getLeaderboard };
