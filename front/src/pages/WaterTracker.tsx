import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  LinearProgress,
  Stack,
  IconButton,
  Slider,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import {
  LocalDrink as LocalDrinkIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Opacity as OpacityIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Interface for water consumption data
interface WaterData {
  day: string;
  amount: number;
  goal: number;
}

// Generate mock data for the past week
const generateWeekData = (): WaterData[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    amount: Math.floor(Math.random() * 8) + 2, // Random amount between 2-10 glasses
    goal: 8 // Default goal is 8 glasses
  }));
};

interface WaterTrackerProps {
  initialWaterIntake?: number;
  onWaterUpdate?: (newWaterIntake: number) => void;
}

const WaterTracker: React.FC<WaterTrackerProps> = ({ 
  initialWaterIntake = 0, 
  onWaterUpdate 
}) => {
  // State for water tracking
  const [waterGoal, setWaterGoal] = useState<number>(8); // Default goal: 8 glasses
  const [waterConsumed, setWaterConsumed] = useState<number>(initialWaterIntake);
  const [customAmount, setCustomAmount] = useState<number>(1);

  // Update water consumed when initialWaterIntake changes
  useEffect(() => {
    setWaterConsumed(Math.round(initialWaterIntake / 250));
  }, [initialWaterIntake]);
  const [weeklyData, setWeeklyData] = useState<WaterData[]>(generateWeekData());
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Calculate progress percentage
  const waterProgress = Math.min((waterConsumed / waterGoal) * 100, 100);

  // Add water function
  const addWater = (amount: number) => {
    const newAmount = waterConsumed + amount;
    setWaterConsumed(newAmount);
    
    // Update today's data in the weekly chart
    const updatedData = weeklyData.map((day, index) => {
      if (index === weeklyData.length - 1) {
        return { ...day, amount: newAmount };
      }
      return day;
    });
    setWeeklyData(updatedData);
    
    // Show success message
    setSuccessMessage(`Added ${amount} glass${amount !== 1 ? 'es' : ''} of water!`);
    setShowSuccess(true);
    
    // Check if goal reached
    if (newAmount >= waterGoal && waterConsumed < waterGoal) {
      setSuccessMessage('Congratulations! You reached your daily water goal! 🎉');
      setShowSuccess(true);
    }
  };

  // Enhanced addWater with callback
  const addWaterWithCallback = (amount: number) => {
    const newWaterAmount = waterConsumed + amount;
    setWaterConsumed(newWaterAmount);
    
    // Call the callback to update parent component with ml amount
    if (onWaterUpdate) {
      onWaterUpdate(newWaterAmount * 250); // Convert glasses to ml
    }
    
    // Update today's data in weekly chart
    setWeeklyData(prevData => 
      prevData.map((day, index) => 
        index === 6 ? { ...day, amount: newWaterAmount * 250 } : day
      )
    );
  };

  // Update water goal
  const updateWaterGoal = (newGoal: number) => {
    setWaterGoal(newGoal);
    
    // Update goal in chart data
    const updatedData = weeklyData.map(day => ({
      ...day,
      goal: newGoal
    }));
    setWeeklyData(updatedData);
    
    setSuccessMessage(`Water goal updated to ${newGoal} glasses!`);
    setShowSuccess(true);
  };
  
  // Handle custom amount change
  const handleCustomAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0) {
      setCustomAmount(value);
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setShowSuccess(false);
  };

  // Render water glasses
  const renderWaterGlasses = () => {
    const glasses = [];
    const totalGlasses = 8; // Display up to 8 glasses maximum
    
    for (let i = 0; i < totalGlasses; i++) {
      glasses.push(
        <Box 
          key={i} 
          sx={{ 
            display: 'inline-flex',
            position: 'relative',
            mx: 0.5
          }}
        >
          <LocalDrinkIcon 
            sx={{ 
              fontSize: 40, 
              color: i < waterConsumed ? 'primary.main' : 'grey.300',
              transition: 'color 0.3s ease-in-out'
            }} 
          />
          {i < waterConsumed && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '70%',
                background: 'linear-gradient(180deg, #a8d0ff 0%, #4285f4 100%)',
                borderRadius: '0 0 4px 4px',
                zIndex: -1,
                opacity: 0.7
              }}
            />
          )}
        </Box>
      );
    }
    
    return glasses;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Water Tracker
      </Typography>
      
      <Grid container spacing={3}>
        {/* Main water tracking card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 3, mb: 3, overflow: 'hidden' }}>
            <Box 
              sx={{ 
                p: 2, 
                background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                color: 'white'
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                Today's Hydration
              </Typography>
            </Box>
            
            <CardContent>
              {/* Water progress */}
              <Box sx={{ position: 'relative', mb: 4, mt: 2 }}>
                <Box 
                  sx={{ 
                    height: 120, 
                    borderRadius: 2,
                    border: '1px solid #e0e0e0',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: `${waterProgress}%`,
                      background: 'linear-gradient(180deg, #a8d0ff 0%, #4285f4 100%)',
                      transition: 'height 0.5s ease-in-out'
                    }}
                  />
                  
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column'
                    }}
                  >
                    <Typography variant="h3" fontWeight="bold" color="primary">
                      {waterConsumed} / {waterGoal}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      glasses consumed
                    </Typography>
                  </Box>
                </Box>
                
                <LinearProgress 
                  variant="determinate" 
                  value={waterProgress} 
                  sx={{ 
                    mt: 1, 
                    height: 10, 
                    borderRadius: 5,
                    backgroundColor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'primary.main'
                    }
                  }} 
                />
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {Math.round(waterProgress)}% of daily goal
                </Typography>
              </Box>
              
              {/* Water glasses visualization */}
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                {renderWaterGlasses()}
              </Box>
              
              {/* Quick add buttons */}
              <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<LocalDrinkIcon />} 
                  onClick={() => addWaterWithCallback(1)}
                  sx={{ borderRadius: 2 }}
                >
                  Add 1 Glass
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<LocalDrinkIcon />} 
                  onClick={() => addWaterWithCallback(2)}
                  sx={{ borderRadius: 2 }}
                >
                  Add 2 Glasses
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<OpacityIcon />} 
                  onClick={() => addWaterWithCallback(4)}
                  sx={{ borderRadius: 2 }}
                >
                  Add 1 Bottle (1L)
                </Button>
              </Stack>
              
              {/* Custom amount */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Add Custom Amount:
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <IconButton 
                    onClick={() => setCustomAmount(Math.max(1, customAmount - 1))}
                    size="small"
                    color="primary"
                  >
                    <RemoveIcon />
                  </IconButton>
                  
                  <TextField
                    type="number"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    inputProps={{ min: 1, max: 10 }}
                    size="small"
                    sx={{ width: 60 }}
                  />
                  
                  <IconButton 
                    onClick={() => setCustomAmount(Math.min(10, customAmount + 1))}
                    size="small"
                    color="primary"
                  >
                    <AddIcon />
                  </IconButton>
                  
                  <Button 
                    variant="contained" 
                    onClick={() => addWaterWithCallback(customAmount)}
                    sx={{ borderRadius: 2 }}
                  >
                    Add Water
                  </Button>
                </Stack>
              </Box>
              
              {/* Stats */}
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Today's Stats:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Consumed: {waterConsumed} glasses ({waterConsumed * 250}ml)
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Remaining: {Math.max(0, waterGoal - waterConsumed)} glasses
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Weekly Average: {(weeklyData.reduce((sum, day) => sum + day.amount, 0) / 7).toFixed(1)} glasses/day
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
          
          {/* Settings Card */}
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Water Goal Settings
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Set your daily water consumption goal (in glasses):
              </Typography>
              
              <Box sx={{ px: 2 }}>
                <Slider
                  value={waterGoal}
                  min={1}
                  max={15}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                  onChange={(_, value) => updateWaterGoal(value as number)}
                  sx={{ mt: 2, mb: 3 }}
                />
              </Box>
              
              <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 2, color: 'primary.contrastText' }}>
                <Typography variant="body2">
                  <strong>Healthy Tip:</strong> The recommended daily water intake is about 8 glasses (2 liters) 
                  for most adults, but individual needs may vary based on activity level, climate, and overall health.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Weekly progress chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 3, height: '100%' }}>
            <Box 
              sx={{ 
                p: 2, 
                background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                color: 'white'
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                Weekly Water Consumption
              </Typography>
            </Box>
            
            <CardContent sx={{ height: 'calc(100% - 60px)' }}>
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={weeklyData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#4285f4" 
                      strokeWidth={3}
                      activeDot={{ r: 8 }}
                      name="Glasses Consumed"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="goal" 
                      stroke="#f44336" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Daily Goal"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Track your hydration progress over the past week. The dashed red line shows your daily goal.
              </Typography>
              
              <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 2, color: 'info.contrastText' }}>
                <Typography variant="body2">
                  <strong>Benefits of Proper Hydration:</strong>
                </Typography>
                <Typography variant="body2" component="ul" sx={{ mt: 1, pl: 2 }}>
                  <li>Improves physical performance</li>
                  <li>Boosts energy levels and brain function</li>
                  <li>Helps with weight management</li>
                  <li>Prevents headaches and migraines</li>
                  <li>Supports skin health</li>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Success notification */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          variant="filled" 
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WaterTracker;
