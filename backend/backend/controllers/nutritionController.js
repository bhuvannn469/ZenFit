const { NutritionDay, Meal, Food } = require('../models/Nutrition');

// Get nutrition day for specified date
exports.getNutritionDay = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.id;
    
    const queryDate = new Date(date);
    
    // Try to find an existing day
    let nutritionDay = await NutritionDay.findOne({ 
      user: userId,
      date: {
        $gte: new Date(queryDate.setHours(0, 0, 0, 0)),
        $lt: new Date(queryDate.setHours(23, 59, 59, 999))
      }
    }).populate('meals');
    
    if (!nutritionDay) {
      return res.status(404).json({ message: 'No nutrition data found for this date' });
    }
    
    res.json(nutritionDay);
  } catch (error) {
    console.error('Error fetching nutrition day:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all nutrition days for user
exports.getAllNutritionDays = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const nutritionDays = await NutritionDay.find({ user: userId })
      .sort({ date: -1 })
      .populate('meals');
    
    res.json(nutritionDays);
  } catch (error) {
    console.error('Error fetching nutrition days:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create or update nutrition day
exports.saveNutritionDay = async (req, res) => {
  try {
    const userId = req.user.id;
    const nutritionData = req.body;
    
    const date = new Date(nutritionData.date);
    
    // Try to find an existing day
    let nutritionDay = await NutritionDay.findOne({ 
      user: userId,
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      }
    });
    
    if (nutritionDay) {
      // Update existing day
      nutritionDay.targetCalories = nutritionData.targetCalories || nutritionDay.targetCalories;
      nutritionDay.targetProtein = nutritionData.targetProtein || nutritionDay.targetProtein;
      nutritionDay.targetCarbs = nutritionData.targetCarbs || nutritionDay.targetCarbs;
      nutritionDay.targetFat = nutritionData.targetFat || nutritionDay.targetFat;
      
      await nutritionDay.save();
    } else {
      // Create new day
      nutritionDay = await NutritionDay.create({
        user: userId,
        date: date,
        targetCalories: nutritionData.targetCalories || 2000,
        targetProtein: nutritionData.targetProtein || 150,
        targetCarbs: nutritionData.targetCarbs || 200,
        targetFat: nutritionData.targetFat || 65,
        waterIntake: nutritionData.waterIntake || 0,
        meals: []
      });
    }
    
    res.status(201).json(nutritionDay);
  } catch (error) {
    console.error('Error saving nutrition day:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update nutrition day
exports.updateNutritionDay = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;
    
    const nutritionDay = await NutritionDay.findOne({ _id: id, user: userId });
    
    if (!nutritionDay) {
      return res.status(404).json({ message: 'Nutrition day not found' });
    }
    
    // Update fields
    if (updateData.targetCalories) nutritionDay.targetCalories = updateData.targetCalories;
    if (updateData.targetProtein) nutritionDay.targetProtein = updateData.targetProtein;
    if (updateData.targetCarbs) nutritionDay.targetCarbs = updateData.targetCarbs;
    if (updateData.targetFat) nutritionDay.targetFat = updateData.targetFat;
    if (updateData.waterIntake !== undefined) nutritionDay.waterIntake = updateData.waterIntake;
    
    await nutritionDay.save();
    
    res.json(nutritionDay);
  } catch (error) {
    console.error('Error updating nutrition day:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update water intake
exports.updateWaterIntake = async (req, res) => {
  try {
    const { date } = req.params;
    const { waterIntake } = req.body;
    const userId = req.user.id;
    
    const queryDate = new Date(date);
    
    let nutritionDay = await NutritionDay.findOne({ 
      user: userId,
      date: {
        $gte: new Date(queryDate.setHours(0, 0, 0, 0)),
        $lt: new Date(queryDate.setHours(23, 59, 59, 999))
      }
    });
    
    if (!nutritionDay) {
      nutritionDay = await NutritionDay.create({
        user: userId,
        date: queryDate,
        waterIntake: waterIntake,
        meals: []
      });
    } else {
      nutritionDay.waterIntake = waterIntake;
      await nutritionDay.save();
    }
    
    res.json(nutritionDay);
  } catch (error) {
    console.error('Error updating water intake:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add meal to day
exports.addMeal = async (req, res) => {
  try {
    const { date } = req.params;
    const mealData = req.body;
    const userId = req.user.id;
    
    const queryDate = new Date(date);
    
    // First, create the meal
    const meal = await Meal.create({
      user: userId,
      name: mealData.name,
      time: mealData.time,
      date: queryDate,
      foods: mealData.foods
    });
    
    // Find nutrition day or create if doesn't exist
    let nutritionDay = await NutritionDay.findOne({ 
      user: userId,
      date: {
        $gte: new Date(queryDate.setHours(0, 0, 0, 0)),
        $lt: new Date(queryDate.setHours(23, 59, 59, 999))
      }
    });
    
    if (!nutritionDay) {
      nutritionDay = await NutritionDay.create({
        user: userId,
        date: queryDate,
        meals: [meal._id]
      });
    } else {
      nutritionDay.meals.push(meal._id);
      await nutritionDay.save();
    }
    
    res.status(201).json(meal);
  } catch (error) {
    console.error('Error adding meal:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update meal
exports.updateMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;
    
    const meal = await Meal.findOne({ _id: id, user: userId });
    
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    
    // Update fields
    if (updateData.name) meal.name = updateData.name;
    if (updateData.time) meal.time = updateData.time;
    if (updateData.foods) meal.foods = updateData.foods;
    
    await meal.save();
    
    res.json(meal);
  } catch (error) {
    console.error('Error updating meal:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete meal
exports.deleteMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const meal = await Meal.findOne({ _id: id, user: userId });
    
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    
    // Remove meal reference from nutrition day
    await NutritionDay.updateMany(
      { user: userId, meals: id },
      { $pull: { meals: id } }
    );
    
    // Delete the meal
    await Meal.deleteOne({ _id: id });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting meal:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get nutrition summary
exports.getNutritionSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.id;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Find all meals in date range
    const meals = await Meal.find({
      user: userId,
      date: {
        $gte: start,
        $lte: end
      }
    });
    
    // Find all nutrition days in date range
    const nutritionDays = await NutritionDay.find({
      user: userId,
      date: {
        $gte: start,
        $lte: end
      }
    });
    
    // Calculate summary
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalWater = 0;
    
    meals.forEach(meal => {
      meal.foods.forEach(food => {
        totalCalories += food.calories * food.quantity;
        totalProtein += food.protein * food.quantity;
        totalCarbs += food.carbs * food.quantity;
        totalFat += food.fat * food.quantity;
      });
    });
    
    nutritionDays.forEach(day => {
      totalWater += day.waterIntake;
    });
    
    const summary = {
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      totalWater,
      dailyAvgCalories: Math.round(totalCalories / ((end - start) / (1000 * 60 * 60 * 24))),
      dailyAvgProtein: Math.round(totalProtein / ((end - start) / (1000 * 60 * 60 * 24))),
      dailyAvgCarbs: Math.round(totalCarbs / ((end - start) / (1000 * 60 * 60 * 24))),
      dailyAvgFat: Math.round(totalFat / ((end - start) / (1000 * 60 * 60 * 24))),
      dailyAvgWater: Math.round(totalWater / ((end - start) / (1000 * 60 * 60 * 24)))
    };
    
    res.json(summary);
  } catch (error) {
    console.error('Error getting nutrition summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search food database
exports.searchFoods = async (req, res) => {
  try {
    const { query } = req.query;
    
    // This would connect to an external API in a production app
    // For now, we'll return mock data based on the search query
    const mockFoods = [
      { 
        name: 'Chicken Breast', 
        calories: 165, 
        protein: 31, 
        carbs: 0, 
        fat: 3.6, 
        servingSize: '100g' 
      },
      { 
        name: 'Brown Rice', 
        calories: 112, 
        protein: 2.6, 
        carbs: 22.9, 
        fat: 0.9, 
        servingSize: '100g' 
      },
      { 
        name: 'Egg', 
        calories: 70, 
        protein: 6, 
        carbs: 0.6, 
        fat: 5, 
        servingSize: '1 large' 
      },
    ];
    
    const filteredFoods = mockFoods.filter(food => 
      food.name.toLowerCase().includes(query.toLowerCase())
    );
    
    res.json(filteredFoods);
  } catch (error) {
    console.error('Error searching foods:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
