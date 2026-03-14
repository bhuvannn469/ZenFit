import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, Button, Card, CardContent, Divider, Snackbar, Alert, 
  Grid, TextField, Tabs, Tab, LinearProgress, MenuItem, IconButton,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import DashboardLayout from '../components/DashboardLayout';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import WaterTracker from './WaterTracker';
import { nutritionService, Food, Meal, NutritionDay } from '../services/nutritionService';

const NutritionTracker: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [foodInput, setFoodInput] = useState('');
  const [foodQuantity, setFoodQuantity] = useState(1);
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');
  const [loading, setLoading] = useState(false);
  const [editingFood, setEditingFood] = useState<{ mealId: string; foodIndex: number } | null>(null);
  const [addMealDialog, setAddMealDialog] = useState(false);
  const [newMealName, setNewMealName] = useState('');
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState<{ 
    open: boolean; 
    message: string; 
    severity: 'success' | 'error' | 'info' | 'warning' 
  }>({ open: false, message: '', severity: 'success' });
  
  // Real-time nutrition data from database
  const [todayNutrition, setTodayNutrition] = useState<NutritionDay>({
    date: new Date().toISOString().split('T')[0],
    targetCalories: 2000,
    targetProtein: 150,
    targetCarbs: 250,
    targetFat: 70,
    meals: [],
    waterIntake: 0
  });

  // Initialize data when component mounts
  useEffect(() => {
    loadTodayNutrition();
  }, []);

  const loadTodayNutrition = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const nutritionDay = await nutritionService.getNutritionDay(today);
      setTodayNutrition(nutritionDay);
    } catch (error: any) {
      // If no data found, create default structure
      if (error.message === 'No nutrition data found for this date') {
        const defaultNutrition: NutritionDay = {
          date: new Date().toISOString().split('T')[0],
          targetCalories: 2000,
          targetProtein: 150,
          targetCarbs: 250,
          targetFat: 70,
          meals: [],
          waterIntake: 0
        };
        setTodayNutrition(defaultNutrition);
        // Save default structure to database
        try {
          await nutritionService.saveNutritionDay(defaultNutrition);
        } catch (saveError) {
          console.log('Could not save default nutrition day:', saveError);
        }
      } else {
        setSnackbar({ open: true, message: 'Error loading nutrition data', severity: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  // Real-time database functions
  const handleAddFood = async () => {
    if (!foodInput.trim()) {
      setSnackbar({ open: true, message: 'Please enter a food name', severity: 'error' });
      return;
    }

    try {
      setLoading(true);
      
      // Create new food item with realistic nutritional values
      const newFood: Food & { quantity: number } = {
        name: foodInput,
        calories: 150, // Default values - could be improved with food database
        protein: 10,
        carbs: 15,
        fat: 5,
        servingSize: '1 serving',
        quantity: foodQuantity
      };

      // Find existing meal or create new one
      let targetMeal = todayNutrition.meals.find(meal => 
        meal.name.toLowerCase() === selectedMealType.toLowerCase()
      );

      if (targetMeal?.id) {
        // Update existing meal
        const updatedFoods = [...targetMeal.foods, newFood];
        await nutritionService.updateMeal(targetMeal.id, { foods: updatedFoods });
      } else {
        // Create new meal
        const newMeal: Omit<Meal, 'id' | 'user'> = {
          name: selectedMealType,
          time: new Date().toTimeString().slice(0, 5),
          date: todayNutrition.date,
          foods: [newFood]
        };
        await nutritionService.addMeal(todayNutrition.date, newMeal);
      }

      // Reload nutrition data to reflect changes
      await loadTodayNutrition();
      
      // Reset form
      setFoodInput('');
      setFoodQuantity(1);
      
      setSnackbar({ 
        open: true, 
        message: `Added ${foodInput} to ${selectedMealType}`, 
        severity: 'success' 
      });
    } catch (error) {
      console.error('Error adding food:', error);
      setSnackbar({ open: true, message: 'Error adding food', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFood = async (mealId: string, foodIndex: number) => {
    try {
      setLoading(true);
      
      const meal = todayNutrition.meals.find(m => m.id === mealId);
      if (!meal) return;

      const updatedFoods = meal.foods.filter((_, index) => index !== foodIndex);
      await nutritionService.updateMeal(mealId, { foods: updatedFoods });
      
      // Reload nutrition data
      await loadTodayNutrition();
      
      setSnackbar({ open: true, message: 'Food deleted successfully', severity: 'success' });
    } catch (error) {
      console.error('Error deleting food:', error);
      setSnackbar({ open: true, message: 'Error deleting food', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditFood = async (mealId: string, foodIndex: number, updatedFood: Food & { quantity: number }) => {
    try {
      setLoading(true);
      
      const meal = todayNutrition.meals.find(m => m.id === mealId);
      if (!meal) return;

      const updatedFoods = meal.foods.map((food, index) => 
        index === foodIndex ? updatedFood : food
      );
      
      await nutritionService.updateMeal(mealId, { foods: updatedFoods });
      
      // Reload nutrition data
      await loadTodayNutrition();
      
      setEditingFood(null);
      setSnackbar({ open: true, message: 'Food updated successfully', severity: 'success' });
    } catch (error) {
      console.error('Error updating food:', error);
      setSnackbar({ open: true, message: 'Error updating food', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeal = async (mealId: string) => {
    try {
      setLoading(true);
      
      await nutritionService.deleteMeal(mealId);
      
      // Reload nutrition data
      await loadTodayNutrition();
      
      setSnackbar({ open: true, message: 'Meal deleted successfully', severity: 'success' });
    } catch (error) {
      console.error('Error deleting meal:', error);
      setSnackbar({ open: true, message: 'Error deleting meal', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeal = async () => {
    if (!newMealName.trim()) {
      setSnackbar({ open: true, message: 'Please enter a meal name', severity: 'error' });
      return;
    }

    try {
      setLoading(true);
      
      const newMeal: Omit<Meal, 'id' | 'user'> = {
        name: newMealName,
        time: new Date().toTimeString().slice(0, 5),
        date: todayNutrition.date,
        foods: []
      };
      
      await nutritionService.addMeal(todayNutrition.date, newMeal);
      await loadTodayNutrition();
      
      setNewMealName('');
      setAddMealDialog(false);
      setSnackbar({ open: true, message: `Added ${newMealName} meal`, severity: 'success' });
    } catch (error) {
      console.error('Error adding meal:', error);
      setSnackbar({ open: true, message: 'Error adding meal', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWater = async (newWaterIntake: number) => {
    try {
      await nutritionService.updateWaterIntake(todayNutrition.date, newWaterIntake);
      
      setTodayNutrition(prev => ({
        ...prev,
        waterIntake: newWaterIntake
      }));
      
      setSnackbar({ open: true, message: 'Water intake updated', severity: 'success' });
    } catch (error) {
      console.error('Error updating water intake:', error);
      setSnackbar({ open: true, message: 'Error updating water intake', severity: 'error' });
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    todayNutrition.meals.forEach(meal => {
      meal.foods.forEach(food => {
        totalCalories += food.calories * food.quantity;
        totalProtein += food.protein * food.quantity;
        totalCarbs += food.carbs * food.quantity;
        totalFat += food.fat * food.quantity;
      });
    });

    return { totalCalories, totalProtein, totalCarbs, totalFat };
  };

  const { totalCalories, totalProtein, totalCarbs, totalFat } = calculateTotals();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getMealGradient = (mealName: string) => {
    const name = mealName.toLowerCase();
    if (name.includes('breakfast')) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    if (name.includes('lunch')) return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    if (name.includes('dinner')) return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    if (name.includes('snack')) return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
    return 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {/* Header with Refresh Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <RestaurantIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              Nutrition Tracker
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadTodayNutrition}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddMealDialog(true)}
              sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              Add Meal
            </Button>
          </Box>
        </Box>

        {/* Loading Indicator */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Tabs */}
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            label="Summary" 
            icon={<TrendingUpIcon />} 
            iconPosition="start"
            sx={{ fontWeight: 600 }}
          />
          <Tab 
            label="Meals" 
            icon={<RestaurantIcon />} 
            iconPosition="start"
            sx={{ fontWeight: 600 }}
          />
          <Tab 
            label="Water" 
            icon={<LocalDrinkIcon />} 
            iconPosition="start"
            sx={{ fontWeight: 600 }}
          />
        </Tabs>

        {/* Summary Tab */}
        {tabValue === 0 && (
          <Grid container spacing={3}>
            {/* Daily Summary Cards */}
            <Grid item xs={12} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', 
                color: 'white',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(255, 154, 158, 0.3)'
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <LocalFireDepartmentIcon sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="h4" fontWeight="bold">{Math.round(totalCalories)}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    of {todayNutrition.targetCalories} kcal
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min((totalCalories / todayNutrition.targetCalories) * 100, 100)}
                    sx={{ 
                      mt: 2, 
                      bgcolor: 'rgba(255,255,255,0.3)',
                      '& .MuiLinearProgress-bar': { bgcolor: 'white' }
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', 
                color: 'white',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(168, 237, 234, 0.3)'
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <FitnessCenterIcon sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="h4" fontWeight="bold">{Math.round(totalProtein)}g</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    of {todayNutrition.targetProtein}g protein
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min((totalProtein / todayNutrition.targetProtein) * 100, 100)}
                    sx={{ 
                      mt: 2, 
                      bgcolor: 'rgba(255,255,255,0.3)',
                      '& .MuiLinearProgress-bar': { bgcolor: 'white' }
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', 
                color: 'white',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(255, 236, 210, 0.3)'
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <FlashOnIcon sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="h4" fontWeight="bold">{Math.round(totalCarbs)}g</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    of {todayNutrition.targetCarbs}g carbs
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min((totalCarbs / todayNutrition.targetCarbs) * 100, 100)}
                    sx={{ 
                      mt: 2, 
                      bgcolor: 'rgba(255,255,255,0.3)',
                      '& .MuiLinearProgress-bar': { bgcolor: 'white' }
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', 
                color: 'white',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(210, 153, 194, 0.3)'
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <WaterDropIcon sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="h4" fontWeight="bold">{Math.round(totalFat)}g</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    of {todayNutrition.targetFat}g fat
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min((totalFat / todayNutrition.targetFat) * 100, 100)}
                    sx={{ 
                      mt: 2, 
                      bgcolor: 'rgba(255,255,255,0.3)',
                      '& .MuiLinearProgress-bar': { bgcolor: 'white' }
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Today's Insights */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Today's Insights
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          📈 Calories Progress: {Math.round((totalCalories / todayNutrition.targetCalories) * 100)}%
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          💪 Protein Intake: {totalProtein > todayNutrition.targetProtein ? 'Exceeded!' : 'On Track'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          🥤 Water: {todayNutrition.waterIntake}ml consumed
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Meals Tab */}
        {tabValue === 1 && (
          <Grid container spacing={3}>
            {/* Quick Add Food Section */}
            <Grid item xs={12}>
              <Card sx={{ 
                borderRadius: 3, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
              }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <AddIcon sx={{ mr: 1 }} />
                    Quick Add Food
                  </Typography>
                  
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Food Name"
                        value={foodInput}
                        onChange={(e) => setFoodInput(e.target.value)}
                        fullWidth
                        placeholder="e.g. Chicken Breast"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={6} sm={2}>
                      <TextField
                        label="Quantity"
                        type="number"
                        value={foodQuantity}
                        onChange={(e) => setFoodQuantity(Number(e.target.value))}
                        fullWidth
                        inputProps={{ min: 1 }}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        select
                        label="Add to Meal"
                        value={selectedMealType}
                        onChange={(e) => setSelectedMealType(e.target.value)}
                        fullWidth
                        variant="outlined"
                      >
                        <MenuItem value="Breakfast">Breakfast</MenuItem>
                        <MenuItem value="Lunch">Lunch</MenuItem>
                        <MenuItem value="Dinner">Dinner</MenuItem>
                        <MenuItem value="Snack">Snack</MenuItem>
                        {todayNutrition.meals.map(meal => (
                          <MenuItem key={meal.id || meal.name} value={meal.name}>
                            {meal.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Button 
                        variant="contained" 
                        fullWidth 
                        sx={{ 
                          height: '56px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
                          }
                        }}
                        onClick={handleAddFood}
                        disabled={loading}
                      >
                        {loading ? <CircularProgress size={24} /> : 'Add Food'}
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Meals Grid */}
            <Grid item xs={12}>
              <Grid container spacing={3}>
                {todayNutrition.meals.length === 0 ? (
                  <Grid item xs={12}>
                    <Card sx={{ borderRadius: 3, textAlign: 'center', py: 4 }}>
                      <CardContent>
                        <RestaurantIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                          No meals logged yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Start by adding your first meal above!
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ) : (
                  todayNutrition.meals.map((meal) => (
                    <Grid item xs={12} md={6} lg={4} key={meal.id || meal.name}>
                      <Card sx={{ 
                        borderRadius: 3,
                        background: getMealGradient(meal.name),
                        color: 'white',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                        minHeight: 280
                      }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" fontWeight="bold">
                              {meal.name}
                            </Typography>
                            <Box>
                              <IconButton 
                                size="small" 
                                sx={{ color: 'white', mr: 1 }}
                                onClick={() => meal.id && handleDeleteMeal(meal.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Box>
                          
                          <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                            {meal.time && `📍 ${meal.time}`}
                          </Typography>

                          <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.3)' }} />

                          {meal.foods.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 2 }}>
                              <RestaurantIcon sx={{ fontSize: 40, opacity: 0.6, mb: 1 }} />
                              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                No foods added yet
                              </Typography>
                            </Box>
                          ) : (
                            <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                              {meal.foods.map((food, foodIndex) => (
                                <Box key={`${meal.id}-${foodIndex}-${food.name}`} sx={{ 
                                  mb: 1, 
                                  p: 1.5, 
                                  bgcolor: 'rgba(255,255,255,0.1)', 
                                  borderRadius: 2,
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                                }}>
                                  {editingFood?.mealId === meal.id && editingFood?.foodIndex === foodIndex ? (
                                    <Box sx={{ flex: 1 }}>
                                      <TextField
                                        size="small"
                                        fullWidth
                                        defaultValue={food.name}
                                        id={`edit-food-name-${meal.id}-${foodIndex}`}
                                        sx={{ 
                                          mb: 1,
                                          '& .MuiOutlinedInput-root': { 
                                            bgcolor: 'white',
                                            '& input': { color: 'black' }
                                          }
                                        }}
                                      />
                                      <Box sx={{ display: 'flex', gap: 1 }}>
                                        <IconButton 
                                          size="small"
                                          sx={{ color: 'white' }}
                                          onClick={() => {
                                            const nameEl = document.getElementById(`edit-food-name-${meal.id}-${foodIndex}`) as HTMLInputElement;
                                            const updatedFood = {
                                              ...food,
                                              name: nameEl.value
                                            };
                                            meal.id && handleEditFood(meal.id, foodIndex, updatedFood);
                                          }}
                                        >
                                          <SaveIcon />
                                        </IconButton>
                                        <IconButton 
                                          size="small"
                                          sx={{ color: 'white' }}
                                          onClick={() => setEditingFood(null)}
                                        >
                                          <CancelIcon />
                                        </IconButton>
                                      </Box>
                                    </Box>
                                  ) : (
                                    <>
                                      <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2" fontWeight={600}>
                                          {food.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                          {food.quantity}x • {Math.round(food.calories * food.quantity)} kcal
                                        </Typography>
                                      </Box>
                                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                                        <IconButton 
                                          size="small"
                                          sx={{ color: 'white' }}
                                          onClick={() => setEditingFood({ mealId: meal.id!, foodIndex })}
                                        >
                                          <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton 
                                          size="small"
                                          sx={{ color: 'white' }}
                                          onClick={() => meal.id && handleDeleteFood(meal.id, foodIndex)}
                                        >
                                          <DeleteIcon fontSize="small" />
                                        </IconButton>
                                      </Box>
                                    </>
                                  )}
                                </Box>
                              ))}
                            </Box>
                          )}

                          {/* Meal Totals */}
                          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.3)' }}>
                            <Typography variant="body2" fontWeight={600}>
                              Total: {Math.round(meal.foods.reduce((sum, food) => sum + (food.calories * food.quantity), 0))} kcal
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                )}
              </Grid>
            </Grid>
          </Grid>
        )}

        {/* Water Tab */}
        {tabValue === 2 && (
          <WaterTracker 
            initialWaterIntake={todayNutrition.waterIntake}
            onWaterUpdate={handleUpdateWater}
          />
        )}

        {/* Add Meal Dialog */}
        <Dialog open={addMealDialog} onClose={() => setAddMealDialog(false)}>
          <DialogTitle>Add New Meal</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Meal Name"
              fullWidth
              variant="outlined"
              value={newMealName}
              onChange={(e) => setNewMealName(e.target.value)}
              placeholder="e.g. Mid-Morning Snack"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddMealDialog(false)}>Cancel</Button>
            <Button onClick={handleAddMeal} variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={20} /> : 'Add Meal'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={4000} 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
};

export default NutritionTracker;
