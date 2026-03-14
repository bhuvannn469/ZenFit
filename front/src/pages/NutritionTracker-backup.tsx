import React, { useState } from 'react';
import { Typography, Box, Button, Card, CardContent, Divider, Snackbar, Alert, Grid, Stack, TextField, Avatar, Tabs, Tab, LinearProgress, MenuItem } from '@mui/material';
import DashboardLayout from '../components/DashboardLayout';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import WaterTracker from './WaterTracker';

const NutritionTracker: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [foodInput, setFoodInput] = useState('');
  const [foodQuantity, setFoodQuantity] = useState(1);
  const [selectedMealId, setSelectedMealId] = useState('breakfast');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [todayNutrition] = useState({
    targetCalories: 2000,
    targetProtein: 150,
    targetCarbs: 250,
    targetFat: 70,
    meals: [
      { id: 'breakfast', name: 'Breakfast', foods: [] },
      { id: 'lunch', name: 'Lunch', foods: [] },
      { id: 'dinner', name: 'Dinner', foods: [] },
      { id: 'snacks', name: 'Snacks', foods: [] },
    ]
  });
  // AI Suggestion State
  const [aiSuggestOpen, setAiSuggestOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any | null>(null);

  // Simulate AI meal suggestion
  const handleAiSuggest = () => {
    setAiLoading(true);
    setTimeout(() => {
      setAiSuggestion({
        meal: 'Lunch',
        food: {
          name: 'Grilled Chicken Bowl',
          calories: 520,
          protein: 45,
          carbs: 50,
          fat: 15
        },
        quantity: 1
      });
      setAiLoading(false);
      setAiSuggestOpen(true);
    }, 1200);
  };

  const handleAcceptSuggestion = () => {
    if (aiSuggestion) {
      setFoodInput(aiSuggestion.food.name);
      setFoodQuantity(aiSuggestion.quantity);
      setSelectedMealId('lunch');
      setAiSuggestOpen(false);
      setSnackbar({ open: true, message: 'AI meal suggestion applied!', severity: 'success' });
    }
  };
  const totalCalories = 0;
  const totalProtein = 0;
  const totalCarbs = 0;
  const totalFat = 0;

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => setTabValue(newValue);
  const handleAddFood = () => setSnackbar({ open: true, message: 'Food added (mock)', severity: 'success' });

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 900, mx: 'auto', width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" sx={{ mb: 2 }}>
          <Tab label="Summary" />
          <Tab label="Meals" />
          <Tab label="Water" icon={<LocalDrinkIcon />} iconPosition="start" />
        </Tabs>
        {tabValue === 0 && (
          <Box mb={3}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Card sx={{ p: 2, bgcolor: 'primary.light' }}>
                  <Typography variant="subtitle2">Calories</Typography>
                  <Typography variant="h5" fontWeight={700}>{totalCalories}</Typography>
                  <LinearProgress variant="determinate" value={Math.min((totalCalories / todayNutrition.targetCalories) * 100, 100)} sx={{ mt: 1 }} />
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ p: 2, bgcolor: 'success.light' }}>
                  <Typography variant="subtitle2">Protein (g)</Typography>
                  <Typography variant="h5" fontWeight={700}>{totalProtein}</Typography>
                  <LinearProgress variant="determinate" value={Math.min((totalProtein / todayNutrition.targetProtein) * 100, 100)} sx={{ mt: 1 }} />
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ p: 2, bgcolor: 'info.light' }}>
                  <Typography variant="subtitle2">Carbs (g)</Typography>
                  <Typography variant="h5" fontWeight={700}>{totalCarbs}</Typography>
                  <LinearProgress variant="determinate" value={Math.min((totalCarbs / todayNutrition.targetCarbs) * 100, 100)} sx={{ mt: 1 }} />
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ p: 2, bgcolor: 'secondary.light' }}>
                  <Typography variant="subtitle2">Fat (g)</Typography>
                  <Typography variant="h5" fontWeight={700}>{totalFat}</Typography>
                  <LinearProgress variant="determinate" value={Math.min((totalFat / todayNutrition.targetFat) * 100, 100)} sx={{ mt: 1 }} />
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
        {tabValue === 1 && (
          <>
            {/* AI Suggest Meal Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button variant="outlined" color="secondary" onClick={handleAiSuggest} disabled={aiLoading} startIcon={<RestaurantIcon />}>
                {aiLoading ? 'Thinking...' : 'AI Suggest Meal Plan'}
              </Button>
            </Box>
            {/* AI Suggestion Modal */}
            {aiSuggestOpen && aiSuggestion && (
              <Box sx={{ mb: 2, p: 2, bgcolor: '#f7f8fa', borderRadius: 2, boxShadow: 2 }}>
                <Typography variant="h6" fontWeight={700} mb={1}>AI Suggested Meal</Typography>
                <Typography fontWeight={600}>{aiSuggestion.food.name}</Typography>
                <Typography variant="body2">Calories: {aiSuggestion.food.calories} | Protein: {aiSuggestion.food.protein}g | Carbs: {aiSuggestion.food.carbs}g | Fat: {aiSuggestion.food.fat}g</Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button variant="contained" color="primary" onClick={handleAcceptSuggestion}>Accept</Button>
                  <Button variant="outlined" color="secondary" onClick={() => setAiSuggestOpen(false)}>Close</Button>
                </Box>
              </Box>
            )}
            <Box mb={3}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Food Name"
                    value={foodInput}
                    onChange={e => setFoodInput(e.target.value)}
                    fullWidth
                    placeholder="e.g. Chicken Breast"
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <TextField
                    label="Quantity"
                    type="number"
                    value={foodQuantity}
                    onChange={e => setFoodQuantity(Number(e.target.value))}
                    fullWidth
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    select
                    label="Meal"
                    value={selectedMealId}
                    onChange={e => setSelectedMealId(e.target.value)}
                    fullWidth
                  >
                    {todayNutrition.meals.map(meal => (
                      <MenuItem key={meal.id} value={meal.id}>{meal.name}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button variant="contained" color="primary" fullWidth sx={{ height: '100%' }} onClick={handleAddFood}>
                    Add Food
                  </Button>
                </Grid>
              </Grid>
            </Box>
            <Grid container spacing={3}>
              {todayNutrition.meals.map((meal) => (
                <Grid item xs={12} sm={6} md={4} key={meal.id}>
                  <Card elevation={2} sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={600}>{meal.name}</Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="subtitle2">Foods:</Typography>
                      {meal.foods.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">No foods added.</Typography>
                      ) : (
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                          {meal.foods.map((food: any, idx: number) => (
                            <li key={idx}>
                              <Typography variant="body2">
                                {food.name} - {food.calories} kcal, {food.protein}g P, {food.carbs}g C, {food.fat}g F
                              </Typography>
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
};

export default NutritionTracker;