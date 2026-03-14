import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Stack, Avatar, LinearProgress, Card, CardContent, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const Home: React.FC = () => {
  // Sample workout data for visualization
  const [workoutData, setWorkoutData] = useState([
    { name: 'Mon', workouts: 2, calories: 450, duration: 60 },
    { name: 'Tue', workouts: 1, calories: 320, duration: 45 },
    { name: 'Wed', workouts: 3, calories: 580, duration: 90 },
    { name: 'Thu', workouts: 1, calories: 290, duration: 30 },
    { name: 'Fri', workouts: 2, calories: 490, duration: 75 },
    { name: 'Sat', workouts: 4, calories: 720, duration: 120 },
    { name: 'Sun', workouts: 1, calories: 180, duration: 25 },
  ]);

  // Weekly progress data
  const weeklyProgress = [
    { week: 'Week 1', weight: 75, bodyfat: 18 },
    { week: 'Week 2', weight: 74.5, bodyfat: 17.8 },
    { week: 'Week 3', weight: 74.2, bodyfat: 17.5 },
    { week: 'Week 4', weight: 73.8, bodyfat: 17.2 },
  ];

  // Workout type distribution
  const workoutTypes = [
    { name: 'Cardio', value: 35, color: '#ff6b6b' },
    { name: 'Strength', value: 40, color: '#4ecdc4' },
    { name: 'Flexibility', value: 15, color: '#45b7d1' },
    { name: 'Sports', value: 10, color: '#96ceb4' },
  ];

  // Goals progress
  const goalsProgress = [
    { goal: 'Weekly Workouts', current: 5, target: 6, percentage: 83 },
    { goal: 'Weight Loss', current: 2.2, target: 5, percentage: 44 },
    { goal: 'Calories Burned', current: 2800, target: 3500, percentage: 80 },
  ];

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
        {/* Welcome Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome back! Ready to crush your fitness goals?
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's your fitness overview for this week
          </Typography>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <Button
            component={Link}
            to="/workouts"
            variant="contained"
            color="primary"
            startIcon={<FitnessCenterIcon />}
            sx={{ borderRadius: 2 }}
          >
            Log Workout
          </Button>
          <Button
            component={Link}
            to="/nutrition"
            variant="contained"
            color="secondary"
            startIcon={<RestaurantIcon />}
            sx={{ borderRadius: 2 }}
          >
            Add Meal
          </Button>
          <Button
            component={Link}
            to="/wellness"
            variant="contained"
            color="info"
            startIcon={<WaterDropIcon />}
            sx={{ borderRadius: 2 }}
          >
            Track Wellness
          </Button>
          <Button
            component={Link}
            to="/workouts/calendar"
            variant="outlined"
            color="primary"
            startIcon={<CalendarMonthIcon />}
            sx={{ borderRadius: 2 }}
          >
            View Calendar
          </Button>
        </Box>

        {/* Main Dashboard Grid */}
        <Grid container spacing={3}>
          {/* Weekly Activity Chart */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    Weekly Activity Overview
                  </Typography>
                </Box>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={workoutData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'calories' ? `${value} cal` : `${value} min`,
                        name === 'calories' ? 'Calories Burned' : 'Duration'
                      ]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="calories" 
                      stackId="1" 
                      stroke="#ff6b6b" 
                      fill="#ff6b6b" 
                      fillOpacity={0.6} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="duration" 
                      stackId="2" 
                      stroke="#4ecdc4" 
                      fill="#4ecdc4" 
                      fillOpacity={0.6} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Workout Distribution */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Workout Type Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={workoutTypes}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {workoutTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ mt: 2 }}>
                  {workoutTypes.map((type, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          backgroundColor: type.color,
                          borderRadius: '50%',
                          mr: 1
                        }}
                      />
                      <Typography variant="body2">
                        {type.name}: {type.value}%
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Progress Tracking */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Progress Tracking
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#ff6b6b" 
                      strokeWidth={3}
                      dot={{ fill: '#ff6b6b' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="bodyfat" 
                      stroke="#4ecdc4" 
                      strokeWidth={3}
                      dot={{ fill: '#4ecdc4' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <Box sx={{ mt: 2, display: 'flex', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 12, height: 3, backgroundColor: '#ff6b6b', mr: 1 }} />
                    <Typography variant="body2">Weight (kg)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 12, height: 3, backgroundColor: '#4ecdc4', mr: 1 }} />
                    <Typography variant="body2">Body Fat (%)</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Goals Progress */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Goals Progress
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {goalsProgress.map((goal, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {goal.goal}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {goal.current}/{goal.target}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={goal.percentage} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 5,
                          backgroundColor: '#f0f0f0',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 5,
                            backgroundColor: goal.percentage > 70 ? '#4caf50' : goal.percentage > 40 ? '#ff9800' : '#f44336'
                          }
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {goal.percentage}% complete
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Button
                  component={Link}
                  to="/analytics"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2, borderRadius: 2 }}
                >
                  View Detailed Analytics
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activities Summary */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  This Week's Summary
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" color="primary.main" fontWeight="bold">
                        12
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Workouts Completed
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" color="secondary.main" fontWeight="bold">
                        3,250
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Calories Burned
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" color="info.main" fontWeight="bold">
                        8.5
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Hours Active
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" color="success.main" fontWeight="bold">
                        92%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Goal Achievement
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default Home;
