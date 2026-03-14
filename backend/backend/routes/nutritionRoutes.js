const express = require('express');
const router = express.Router();
const nutritionController = require('../controllers/nutritionController');
const protect = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(protect);

// Nutrition day routes
router.get('/day/:date', nutritionController.getNutritionDay);
router.get('/days', nutritionController.getAllNutritionDays);
router.post('/day', nutritionController.saveNutritionDay);
router.put('/day/:id', nutritionController.updateNutritionDay);
router.put('/day/:date/water', nutritionController.updateWaterIntake);

// Meal routes
router.post('/day/:date/meal', nutritionController.addMeal);
router.put('/meal/:id', nutritionController.updateMeal);
router.delete('/meal/:id', nutritionController.deleteMeal);

// Food routes
router.get('/foods/search', nutritionController.searchFoods);

// Summary route
router.get('/summary', nutritionController.getNutritionSummary);

module.exports = router;
