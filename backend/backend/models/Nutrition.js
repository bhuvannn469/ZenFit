const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true },
  servingSize: { type: String, required: true }
});

const mealSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: Date, required: true },
  foods: [{
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    servingSize: { type: String, required: true },
    quantity: { type: Number, required: true }
  }]
}, { timestamps: true });

const nutritionDaySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true, unique: true },
  targetCalories: { type: Number, default: 2000 },
  targetProtein: { type: Number, default: 150 },
  targetCarbs: { type: Number, default: 200 },
  targetFat: { type: Number, default: 65 },
  meals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }],
  waterIntake: { type: Number, default: 0 }
}, { timestamps: true });

// Create indexes
nutritionDaySchema.index({ user: 1, date: 1 }, { unique: true });
mealSchema.index({ user: 1, date: 1 });

// Export models
const Food = mongoose.model('Food', foodSchema);
const Meal = mongoose.model('Meal', mealSchema);
const NutritionDay = mongoose.model('NutritionDay', nutritionDaySchema);

module.exports = {
  Food,
  Meal,
  NutritionDay
};
