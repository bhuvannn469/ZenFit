import React, { useState } from 'react';
import { Typography, Box, Button, Card, CardContent, Divider, Snackbar, Alert, Grid, TextField, Tabs, Tab, LinearProgress, MenuItem } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import WaterTracker from './WaterTracker';

const NutritionTracker: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  // State for nutrition tracking
  const [calories] = useState({
    consumed: 1200,
    goal: 2000
  });
  const [macros] = useState({
    protein: { consumed: 60, goal: 150 },
    carbs: { consumed: 120, goal: 200 },
    fat: { consumed: 40, goal: 70 }
  });
  // Define food type
  interface Food {
    id: number;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    serving: string;
  }

  const [meals] = useState([
    {
      name: 'Breakfast',
      calories: 350,
      protein: 20,
      carbs: 30,
      fat: 15
    },
    {
      name: 'Lunch',
      calories: 450,
      protein: 25,
      carbs: 45,
      fat: 15
    },
    {
      name: 'Snack',
      calories: 150,
      protein: 5,
      carbs: 20,
      fat: 5
    },
    {
      name: 'Dinner',
      calories: 550,
      protein: 30,
      carbs: 50,
      fat: 20
    }
  ]);
  // State for food tracking
  const [foodSearch, setFoodSearch] = useState('');
  const [foodResults, setFoodResults] = useState<Food[]>([]);
  const [selectedMeal, setSelectedMeal] = useState('Breakfast');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [portion, setPortion] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => setTabValue(newValue);

  // Mock function to search for foods
  const searchFoods = (query: string): Food[] => {
    // Simulate API call
    const results: Food[] = [
      { id: 1, name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g' },
      { id: 2, name: 'Brown Rice', calories: 112, protein: 2.6, carbs: 23.5, fat: 0.9, serving: '100g' },
      { id: 3, name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11.2, fat: 0.6, serving: '100g' },
      { id: 4, name: 'Salmon', calories: 206, protein: 22.1, carbs: 0, fat: 12.4, serving: '100g' },
      { id: 5, name: 'Greek Yogurt', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, serving: '100g' }
    ];
    return results.filter(food => food.name.toLowerCase().includes(query.toLowerCase()));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Nutrition Tracker
      </Typography>
      
      <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" sx={{ mb: 2 }}>
          <Tab label="Summary" />
          <Tab label="Meals" />
          <Tab label="Water" icon={<LocalDrinkIcon />} iconPosition="start" />
      </Tabs>
      
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* Daily progress */}
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Daily Calories
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h4" fontWeight="bold" sx={{ mr: 2 }}>
                    {calories.consumed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    of {calories.goal} kcal
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(calories.consumed / calories.goal) * 100} 
                  sx={{ height: 10, borderRadius: 5, mb: 1 }} 
                />
                <Typography variant="body2" color="text.secondary">
                  {Math.round((calories.consumed / calories.goal) * 100)}% of daily goal
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Macronutrients
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">
                      Protein
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {macros.protein.consumed}g / {macros.protein.goal}g
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(macros.protein.consumed / macros.protein.goal) * 100} 
                    sx={{ height: 8, borderRadius: 5, mb: 1, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: '#ff5722' } }} 
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">
                      Carbohydrates
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {macros.carbs.consumed}g / {macros.carbs.goal}g
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(macros.carbs.consumed / macros.carbs.goal) * 100} 
                    sx={{ height: 8, borderRadius: 5, mb: 1, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: '#4caf50' } }} 
                  />
                </Box>
                
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">
                      Fat
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {macros.fat.consumed}g / {macros.fat.goal}g
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(macros.fat.consumed / macros.fat.goal) * 100} 
                    sx={{ height: 8, borderRadius: 5, mb: 1, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: '#ffc107' } }} 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Today's meals */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Today's Meals
                </Typography>
                
                {meals.map((meal, index) => (
                  <Box key={`meal-${meal.name}-${index}`} sx={{ mb: index < meals.length - 1 ? 2 : 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {meal.name}
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {meal.calories} kcal
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                          P: {meal.protein}g
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                          C: {meal.carbs}g
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          F: {meal.fat}g
                        </Typography>
                      </Box>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        sx={{ minWidth: 'auto', p: '2px 8px', borderRadius: 4 }}
                      >
                        Details
                      </Button>
                    </Box>
                    
                    {index < meals.length - 1 && <Divider sx={{ mt: 2 }} />}
                  </Box>
                ))}
                
                <Button 
                  variant="contained" 
                  startIcon={<RestaurantIcon />} 
                  sx={{ mt: 3, borderRadius: 2 }}
                >
                  Log Food
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2, mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Add Food
                </Typography>
                
                <TextField
                  label="Search Foods"
                  fullWidth
                  variant="outlined"
                  value={foodSearch}
                  onChange={(e) => {
                    setFoodSearch(e.target.value);
                    if (e.target.value.length >= 2) {
                      setFoodResults(searchFoods(e.target.value));
                    } else {
                      setFoodResults([]);
                    }
                  }}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  select
                  label="Add to Meal"
                  fullWidth
                  variant="outlined"
                  value={selectedMeal}
                  onChange={(e) => setSelectedMeal(e.target.value)}
                  sx={{ mb: 3 }}
                >
                  <MenuItem value="Breakfast">Breakfast</MenuItem>
                  <MenuItem value="Lunch">Lunch</MenuItem>
                  <MenuItem value="Dinner">Dinner</MenuItem>
                  <MenuItem value="Snack">Snack</MenuItem>
                </TextField>
                
                {foodResults.length > 0 && (
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                      {foodResults.map((food, index) => (
                        <Box 
                          key={food.id} 
                          sx={{ 
                            p: 2, 
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'action.hover' },
                            ...(index < foodResults.length - 1 && { borderBottom: '1px solid', borderColor: 'divider' })
                          }}
                          onClick={() => {
                            setSelectedFood(food);
                            setPortion(1);
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1">
                              {food.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {food.calories} kcal / {food.serving}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                          </Typography>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                )}
                
                {selectedFood && (
                  <Card variant="outlined" sx={{ mb: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                    <CardContent>
                      <Typography variant="h6">
                        {selectedFood.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body2">
                          Serving: {selectedFood.serving}
                        </Typography>
                        <Typography variant="body2">
                          {selectedFood.calories} kcal
                        </Typography>
                      </Box>
                      
                      <Divider sx={{ my: 2, borderColor: 'primary.contrastText', opacity: 0.2 }} />
                      
                      <Typography variant="body2" gutterBottom>
                        Number of servings:
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Button 
                          variant="contained" 
                          size="small" 
                          onClick={() => setPortion(Math.max(0.25, portion - 0.25))}
                          sx={{ minWidth: 30, p: 0 }}
                        >
                          -
                        </Button>
                        <TextField
                          type="number"
                          value={portion}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (!isNaN(value) && value > 0) {
                              setPortion(value);
                            }
                          }}
                          InputProps={{ inputProps: { min: 0.25, step: 0.25 } }}
                          sx={{ mx: 2, width: 80 }}
                        />
                        <Button 
                          variant="contained" 
                          size="small" 
                          onClick={() => setPortion(portion + 0.25)}
                          sx={{ minWidth: 30, p: 0 }}
                        >
                          +
                        </Button>
                      </Box>
                      
                      <Typography variant="body1" sx={{ mt: 2 }}>
                        Total: {Math.round(selectedFood.calories * portion)} kcal
                      </Typography>
                      
                      <Button 
                        variant="contained" 
                        fullWidth 
                        sx={{ mt: 2, bgcolor: 'primary.dark' }}
                        onClick={() => {
                          setSuccessMessage(`Added ${selectedFood.name} to ${selectedMeal}`);
                          setShowSuccess(true);
                          setSelectedFood(null);
                          setFoodSearch('');
                          setFoodResults([]);
                        }}
                      >
                        Add to {selectedMeal}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Foods
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Your recently logged foods will appear here.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {tabValue === 2 && (
        <WaterTracker />
      )}
      
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccess(false)} 
          severity="success" 
          variant="filled"
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NutritionTracker;
