const express = require('express');
const router = express.Router();
const {
  addWorkout,
  getWorkouts,
  updateWorkout,
  deleteWorkout,
  getWorkoutCalendar
} = require('../controllers/workoutController');
const { getStreak } = require('../controllers/streakController');
const protect = require('../middleware/authMiddleware');

// Protected Routes
router.post('/', protect, addWorkout);
router.get('/', protect, getWorkouts);
router.put('/:id', protect, updateWorkout);
router.delete('/:id', protect, deleteWorkout);
router.get('/calendar', protect, getWorkoutCalendar);
router.get('/streak', protect, getStreak);

module.exports = router;
