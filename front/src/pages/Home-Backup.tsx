
import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Stack, Avatar, LinearProgress, Card, CardContent, Grid, Paper } from '@mui/material';

import DashboardLayout from '../components/DashboardLayout';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Link } from 'react-router-dom';
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
  const userData = { name: 'Srujan' };
  const dailyGoals = {
    calories: 1200,
    caloriesGoal: 2000,
    water: 1800,
    waterGoal: 3000,
    goalWeight: 0,
    streak: 7,
  };
  const workouts = [
    { name: 'Morning Cardio', status: 'Completed' },
    { name: 'Strength Training', status: 'Pending' },
  ];
  const meals = [
    { name: 'Lunch', time: '1:00 PM' },
    { name: 'Dinner', time: '7:00 PM' },
  ];

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 1400, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Top Greeting and Quick Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            {/* Top bar removed for sidebar-only layout */}
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button component={Link} to="/workouts" variant="contained" color="primary" startIcon={<FitnessCenterIcon />}>Log Workout</Button>
            <Button component={Link} to="/nutrition" variant="contained" color="secondary" startIcon={<RestaurantIcon />}>Add Meal</Button>
            <Button component={Link} to="/wellness" variant="contained" color="info" startIcon={<WaterDropIcon />}>Track Wellness</Button>
          </Box>
        </Box>

        {/* Main Dashboard Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4 }}>
          {/* Left: Activity & Stats */}
          <Box>
            {/* Fitness Activity Graph Placeholder */}
            <Box sx={{ bgcolor: '#fff', borderRadius: 3, p: 3, mb: 3, boxShadow: '0 1px 4px 0 #e5e7eb' }}>
              <Typography variant="h6" fontWeight={700} mb={2}>Fitness Activity</Typography>
              {/* TODO: Insert chart component here */}
              <Box sx={{ height: 180, bgcolor: '#f7f8fa', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'grey.400' }}>
                [Graph Placeholder]
              </Box>
            </Box>
            {/* Today Gain/Stats */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Box sx={{ flex: 1, bgcolor: '#f7f8fa', borderRadius: 2, p: 2, textAlign: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary">Calories</Typography>
                <Typography variant="h5" fontWeight={700}>{dailyGoals.calories}</Typography>
              </Box>
              <Box sx={{ flex: 1, bgcolor: '#f7f8fa', borderRadius: 2, p: 2, textAlign: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary">Water (ml)</Typography>
                <Typography variant="h5" fontWeight={700}>{dailyGoals.water}</Typography>
              </Box>
              <Box sx={{ flex: 1, bgcolor: '#f7f8fa', borderRadius: 2, p: 2, textAlign: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary">Streak</Typography>
                <Typography variant="h5" fontWeight={700}>{dailyGoals.streak} days</Typography>
              </Box>
            </Box>
            {/* Workouts List */}
            <Box sx={{ bgcolor: '#fff', borderRadius: 3, p: 3, mb: 3, boxShadow: '0 1px 4px 0 #e5e7eb' }}>
              <Typography variant="h6" fontWeight={700} mb={2}>Today's Workouts</Typography>
              {workouts.map((w) => (
                <Box key={w.name} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography>{w.name}</Typography>
                  {w.status === 'Completed' ? (
                    <Typography color="success.main">Completed ✔️</Typography>
                  ) : (
                    <Typography color="warning.main">Pending ⭕</Typography>
                  )}
                </Box>
              ))}
              <Button component={Link} to="/workouts/calendar" variant="outlined" color="primary" startIcon={<CalendarMonthIcon />} sx={{ mt: 2 }}>View Workout Calendar</Button>
            </Box>
            {/* Meals List */}
            <Box sx={{ bgcolor: '#fff', borderRadius: 3, p: 3, boxShadow: '0 1px 4px 0 #e5e7eb' }}>
              <Typography variant="h6" fontWeight={700} mb={2}>Upcoming Meals</Typography>
              {meals.map((m) => (
                <Box key={m.name} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Box>
                    <Typography>{m.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{m.time}</Typography>
                  </Box>
                  <Button component={Link} to="/nutrition" variant="contained" color="secondary" size="small">Log Meal</Button>
                </Box>
              ))}
            </Box>
          </Box>
          {/* Right: Suggestions, Analytics, etc. */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Smart Suggestions */}
            <Box sx={{ bgcolor: '#fff', borderRadius: 3, p: 3, boxShadow: '0 1px 4px 0 #e5e7eb' }}>
              <Typography variant="h6" fontWeight={700} mb={2}>Smart Suggestions</Typography>
              <Typography mb={2}>Looks like you're aiming for a new PR! Try a higher intensity workout today.</Typography>
              <Button component={Link} to="/personalized-workout" variant="contained" color="primary">Get Personalized Workout</Button>
            </Box>
            {/* Analytics Navigation */}
            <Box sx={{ bgcolor: '#f7f8fa', borderRadius: 2, p: 3, textAlign: 'center' }}>
              <Button component={Link} to="/analytics" variant="contained" color="info" sx={{ fontSize: 18, py: 2, borderRadius: 3 }}>
                <span role="img" aria-label="analytics">📈</span> View Your Progress & Analytics
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default Home;
          
