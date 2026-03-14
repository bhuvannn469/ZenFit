const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getSummaryStats, getWeeklyStats } = require('../controllers/statsController');

router.get('/summary', protect, getSummaryStats);
router.get('/summary', protect, getSummaryStats);
router.get('/weekly', protect, getWeeklyStats);

module.exports = router;
