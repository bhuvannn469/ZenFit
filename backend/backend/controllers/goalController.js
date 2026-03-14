const Goal = require('../models/Goal');
const Workout = require('../models/Workout');

// Create a new goal
const createGoal = async (req, res) => {
  try {
    const goal = await Goal.create({ ...req.body, user: req.user._id });
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get all goals of the logged-in user
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Check goal progress
const getGoalProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const goals = await Goal.find({ user: userId });

    const today = new Date();
    const progress = [];

    for (const goal of goals) {
      const workouts = await Workout.find({
        user: userId,
        date: { $gte: goal.startDate, $lte: goal.endDate }
      });

      let current = 0;
      if (goal.type === 'calories') {
        current = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
      } else if (goal.type === 'duration') {
        current = workouts.reduce((sum, w) => sum + (w.durationInMinutes || 0), 0);
      } else if (goal.type === 'workouts') {
        current = workouts.length;
      }

      if (current >= goal.target && !goal.achieved) {
        goal.achieved = true;
        await goal.save();
      }

      progress.push({
        goalId: goal._id,
        type: goal.type,
        target: goal.target,
        current,
        percentage: Math.min(100, Math.round((current / goal.target) * 100)),
        achieved: current >= goal.target
      });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Update a goal
const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) return res.status(404).json({ msg: 'Goal not found' });

    Object.assign(goal, req.body);
    await goal.save();
    res.json(goal);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Delete a goal
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) return res.status(404).json({ msg: 'Goal not found' });

    await goal.deleteOne();
    res.json({ msg: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

module.exports = { createGoal, getGoals, getGoalProgress, updateGoal, deleteGoal };
