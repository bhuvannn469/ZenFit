const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { createGoal, getGoals, getGoalProgress, updateGoal, deleteGoal } = require('../controllers/goalController');

router.post('/', protect, createGoal);
router.get('/', protect, getGoals);
router.get('/progress', protect, getGoalProgress);
router.put('/:id', protect, updateGoal);
router.delete('/:id', protect, deleteGoal);

module.exports = router;
