import React from 'react';
import { Typography, Button, Box, LinearProgress, Card, CardContent, Grid, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

const Home: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  // Sample workout data for visualization
  const workoutData = [
    { name: 'Mon', workouts: 2, calories: 450, duration: 60 },
    { name: 'Tue', workouts: 1, calories: 320, duration: 45 },
    { name: 'Wed', workouts: 3, calories: 580, duration: 90 },
    { name: 'Thu', workouts: 1, calories: 290, duration: 30 },
    { name: 'Fri', workouts: 2, calories: 490, duration: 75 },
    { name: 'Sat', workouts: 4, calories: 720, duration: 120 },
    { name: 'Sun', workouts: 1, calories: 180, duration: 25 },
  ];

  // Weekly progress data
  const weeklyProgress = [
    { week: 'Week 1', weight: 75, bodyfat: 18 },
    { week: 'Week 2', weight: 74.5, bodyfat: 17.8 },
    { week: 'Week 3', weight: 74.2, bodyfat: 17.5 },
    { week: 'Week 4', weight: 73.8, bodyfat: 17.2 },
  ];

  // Daily fitness metrics data
  const dailyMetrics = [
    { 
      title: "Today's Calories", 
      value: 420, 
      goal: 600, 
      percentage: 70, 
      icon: "🔥",
      color: "#ff6b6b",
      bgColor: "#fef3f2" 
    },
    { 
      title: "Active Minutes", 
      value: 35, 
      goal: 60, 
      percentage: 58, 
      icon: "⚡",
      color: "#3b82f6",
      bgColor: "#eff6ff" 
    },
    { 
      title: "Steps", 
      value: 7234, 
      goal: 10000, 
      percentage: 72, 
      icon: "👟",
      color: "#10b981",
      bgColor: "#ecfdf5" 
    },
    { 
      title: "Heart Rate", 
      value: 72, 
      goal: null, 
      status: "Resting BPM", 
      quality: "Excellent",
      icon: "💜",
      color: "#8b5cf6",
      bgColor: "#f3e8ff" 
    },
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
        {/* Header with ZenFit App Name and Dark Mode Toggle */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 4
        }}>
          {/* ZenFit App Name - Left Side */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2
          }}>
            <Box
              component="img"
              src="/zenfit-logo.png"
              alt="ZenFit Logo"
              sx={{
                width: 40,
                height: 40,
              }}
            />
            <Typography 
              variant="h3" 
              sx={{
                fontFamily: "'Poppins', 'Inter', 'Roboto', sans-serif",
                fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
                textShadow: 'none',
              }}
            >
              ZenFit
            </Typography>
          </Box>

          {/* Dark Mode Toggle - Right Side */}
          <IconButton
            onClick={toggleTheme}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 2,
              width: 56,
              height: 56,
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                boxShadow: 4,
                transform: 'scale(1.05)',
                bgcolor: 'background.paper'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            {isDarkMode ? (
              <LightModeIcon sx={{ color: '#FFA726', fontSize: 28 }} />
            ) : (
              <DarkModeIcon sx={{ color: '#5C6BC0', fontSize: 28 }} />
            )}
          </IconButton>
        </Box>

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

        {/* Daily Fitness Metrics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {dailyMetrics.map((metric) => (
            <Grid item xs={12} sm={6} md={3} key={metric.title}>
              <Card 
                sx={{ 
                  height: '100%',
                  background: `linear-gradient(135deg, ${metric.bgColor} 0%, ${metric.bgColor}99 100%)`,
                  border: `1px solid ${metric.color}20`,
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: metric.color,
                        fontWeight: 600,
                        fontSize: '0.875rem'
                      }}
                    >
                      {metric.title}
                    </Typography>
                    <Typography variant="h5" sx={{ fontSize: '1.5rem' }}>
                      {metric.icon}
                    </Typography>
                  </Box>
                  
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 800,
                      color: metric.color,
                      mb: 1,
                      fontSize: '2.5rem'
                    }}
                  >
                    {metric.value.toLocaleString()}
                  </Typography>
                  
                  {metric.goal ? (
                    <>
                      <Box sx={{ mb: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={metric.percentage}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(255,255,255,0.3)',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              backgroundColor: metric.color,
                            }
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: metric.color,
                            fontWeight: 600,
                            opacity: 0.8
                          }}
                        >
                          Goal: {metric.goal.toLocaleString()}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: metric.color,
                            fontWeight: 700,
                            fontSize: '0.75rem'
                          }}
                        >
                          {metric.percentage}%
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: metric.color,
                          fontWeight: 600,
                          opacity: 0.8,
                          mb: 1
                        }}
                      >
                        {metric.status}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: metric.color,
                          fontWeight: 700
                        }}
                      >
                        {metric.quality}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

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



          {/* Unified Progress & Goals Section */}
          <Grid item xs={12}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Progress & Goals Tracking
                </Typography>
                
                {/* Progress Chart */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Weekly Progress
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
                </Box>

                {/* Goals Progress */}
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Monthly Goals
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    {goalsProgress.map((goal) => (
                      <Box key={goal.goal} sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {goal.goal}
                          </Typography>
                          <Typography variant="body2" color="primary.main" fontWeight="bold">
                            {goal.percentage}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={goal.percentage} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            backgroundColor: '#f0f0f0',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              backgroundColor: (() => {
                                if (goal.percentage > 70) return '#4caf50';
                                if (goal.percentage > 40) return '#ff9800';
                                return '#f44336';
                              })()
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
                </Box>
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
