const express = require('express');
const router = express.Router();
const wellnessController = require('../controllers/wellnessController');
const protect = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(protect);

// Sleep routes
router.get('/sleep', wellnessController.getSleepEntries);
router.get('/sleep/:date', wellnessController.getSleepEntry);
router.post('/sleep', wellnessController.createSleepEntry);
router.put('/sleep/:id', wellnessController.updateSleepEntry);
router.delete('/sleep/:id', wellnessController.deleteSleepEntry);

// Mood routes
router.get('/mood', wellnessController.getMoodEntries);
router.get('/mood/:date', wellnessController.getMoodEntry);
router.post('/mood', wellnessController.createMoodEntry);
router.put('/mood/:id', wellnessController.updateMoodEntry);
router.delete('/mood/:id', wellnessController.deleteMoodEntry);

// Meditation routes
router.get('/meditation', wellnessController.getMeditationSessions);
router.get('/meditation/:id', wellnessController.getMeditationSession);
router.post('/meditation', wellnessController.createMeditationSession);
router.put('/meditation/:id', wellnessController.updateMeditationSession);
router.delete('/meditation/:id', wellnessController.deleteMeditationSession);

// Summary route
router.get('/summary', wellnessController.getWellnessSummary);

module.exports = router;
