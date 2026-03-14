import React, { useState } from 'react';
import {
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
  CircularProgress,
  Stack,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  Chip,
  Avatar,
  Paper,
} from '@mui/material';
import DashboardLayout from '../components/DashboardLayout';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  FitnessCenter as FitnessCenterIcon,
  TrendingUp as TrendingUpIcon,
  LocalFireDepartment as FireIcon,
  Schedule as ScheduleIcon,
  PlayArrow as PlayIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  Psychology as AiIcon,
  GpsFixed as TargetIcon,
  PieChart as PieChartIcon,
  ShowChart as ShowChartIcon,
  EmojiEvents as EmojiEventsIcon,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend } from 'recharts';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: Readonly<TabPanelProps>) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`workout-tabpanel-${index}`}
      aria-labelledby={`workout-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>{children}</Box>
      )}
    </div>
  );
}

const WorkoutTracker: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [workouts, setWorkouts] = useState<any[]>([
    {
      title: 'Morning Strength Training',
      exercises: [
        { name: 'Squats', sets: 4, reps: 12, weight: 80 },
        { name: 'Bench Press', sets: 3, reps: 10, weight: 70 },
        { name: 'Deadlifts', sets: 3, reps: 8, weight: 100 },
      ],
      scheduledTime: '2025-08-07T06:00',
      caloriesBurned: 420,
      durationInMinutes: 65,
      completed: true
    },
    {
      title: 'Evening Cardio Session',
      exercises: [
        { name: 'Treadmill Run', sets: 1, reps: 30, weight: 0 },
        { name: 'Cycling', sets: 1, reps: 20, weight: 0 },
      ],
      scheduledTime: '2025-08-06T18:00',
      caloriesBurned: 380,
      durationInMinutes: 50,
      completed: true
    }
  ]);
  const [loading] = useState<boolean>(false);
  const [error] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [newWorkout, setNewWorkout] = useState<{
    title: string;
    exercises: {
      name: string;
      sets: number;
      reps: number;
      weight: number;
    }[];
    scheduledTime: string;
    caloriesBurned: number;
    durationInMinutes: number;
  }>({
    title: '',
    exercises: [
      { name: '', sets: 0, reps: 0, weight: 0 }
    ],
    scheduledTime: '',
    caloriesBurned: 0,
    durationInMinutes: 0
  });

  // AI Suggestion State
  const [aiSuggestOpen, setAiSuggestOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{
    title: string;
    exercises: { name: string; sets: number; reps: number; weight?: number }[];
    caloriesBurned: number;
    durationInMinutes: number;
    scheduledTime?: string;
  } | null>(null);

  // Workout type distribution data with modern colors
  const workoutTypeData = [
    { name: 'Strength', value: 45, color: '#667eea' },
    { name: 'Cardio', value: 30, color: '#764ba2' },
    { name: 'Yoga', value: 15, color: '#f093fb' },
    { name: 'HIIT', value: 10, color: '#f5576c' }
  ];

  // Monthly progress data for analytics
  const monthlyProgressData = [
    { month: 'Jan', calories: 2450 },
    { month: 'Feb', calories: 2680 },
    { month: 'Mar', calories: 2890 },
    { month: 'Apr', calories: 3120 },
    { month: 'May', calories: 3350 },
    { month: 'Jun', calories: 3580 }
  ];

  // Weekly activity data for analytics
  const weeklyActivityData = [
    { day: 'Mon', workouts: 2, calories: 450 },
    { day: 'Tue', workouts: 1, calories: 320 },
    { day: 'Wed', workouts: 3, calories: 580 },
    { day: 'Thu', workouts: 2, calories: 420 },
    { day: 'Fri', workouts: 1, calories: 380 },
    { day: 'Sat', workouts: 2, calories: 500 },
    { day: 'Sun', workouts: 1, calories: 300 }
  ];

  // Simulate AI workout suggestion
  const handleAiSuggest = () => {
    setAiLoading(true);
    setTimeout(() => {
      setAiSuggestion({
        title: 'Full Body Strength',
        exercises: [
          { name: 'Squats', sets: 4, reps: 10, weight: 40 },
          { name: 'Push Ups', sets: 3, reps: 15, weight: 0 },
          { name: 'Deadlifts', sets: 3, reps: 8, weight: 50 },
          { name: 'Plank', sets: 3, reps: 1, weight: 0 },
        ],
        scheduledTime: '',
        caloriesBurned: 350,
        durationInMinutes: 55
      });
      setAiLoading(false);
      setAiSuggestOpen(true);
    }, 1200);
  };

  const handleAcceptSuggestion = () => {
    if (aiSuggestion) {
      setNewWorkout({ 
        ...aiSuggestion, 
        scheduledTime: aiSuggestion.scheduledTime || '',
        exercises: aiSuggestion.exercises.map(ex => ({ ...ex, weight: ex.weight || 0 }))
      });
      setAiSuggestOpen(false);
      setSnackbar({ open: true, message: 'AI workout suggestion applied!', severity: 'success' });
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setNewWorkout(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleExerciseChange = (idx: number, field: string, value: any) => {
    setNewWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) =>
        i === idx ? { ...ex, [field]: value } : ex
      )
    }));
  };

  const addExerciseField = () => {
    setNewWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, { name: '', sets: 0, reps: 0, weight: 0 }]
    }));
  };

  const removeExerciseField = (idx: number) => {
    setNewWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.length === 1 ? prev.exercises : prev.exercises.filter((_, i) => i !== idx)
    }));
  };

  const handleCreateWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    setWorkouts(prev => [...prev, newWorkout]);
    setSnackbar({ open: true, message: 'Workout created!', severity: 'success' });
    setNewWorkout({
      title: '',
      exercises: [{ name: '', sets: 0, reps: 0, weight: 0 }],
      scheduledTime: '',
      caloriesBurned: 0,
      durationInMinutes: 0
    });
  };

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%', p: 3 }}>
        {/* Modern Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          p: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 3,
          color: 'white',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
        }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
              💪 Workout Tracker
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Track your fitness journey and achieve your goals
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<AiIcon />}
              onClick={handleAiSuggest}
              disabled={aiLoading}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              {aiLoading ? 'Thinking...' : 'AI Suggest'}
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setTabValue(1)}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              Add Workout
            </Button>
          </Box>
        </Box>

        {/* Modern Tabs */}
        <Paper elevation={0} sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth"
            sx={{ 
              '& .MuiTab-root': { 
                fontWeight: 600, 
                py: 2,
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white'
                }
              }
            }}
          >
            <Tab 
              label="My Workouts" 
              icon={<FitnessCenterIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Add Workout" 
              icon={<AddIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Analytics" 
              icon={<TrendingUpIcon />} 
              iconPosition="start"
            />
          </Tabs>
        </Paper>
        {/* My Workouts Tab */}
        <TabPanel value={tabValue} index={0}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <CircularProgress />
            </Box>
          ) : null}
          {(() => {
            if (loading) {
              return (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                  <CircularProgress />
                </Box>
              );
            }
            if (error) {
              return <Alert severity="error">{error}</Alert>;
            }
            return (
              <>
                {/* Quick Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', 
                      color: 'white',
                      borderRadius: 3,
                      boxShadow: '0 8px 32px rgba(255, 154, 158, 0.3)'
                    }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mx: 'auto', mb: 1 }}>
                          <FitnessCenterIcon />
                        </Avatar>
                        <Typography variant="h4" fontWeight="bold">
                          {workouts.length}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Total Workouts
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', 
                      color: 'white',
                      borderRadius: 3,
                      boxShadow: '0 8px 32px rgba(168, 237, 234, 0.3)'
                    }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mx: 'auto', mb: 1 }}>
                          <FireIcon />
                        </Avatar>
                        <Typography variant="h4" fontWeight="bold">
                          {workouts.reduce((sum, w) => sum + w.caloriesBurned, 0)}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Calories Burned
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                      background: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', 
                      color: 'white',
                      borderRadius: 3,
                      boxShadow: '0 8px 32px rgba(210, 153, 194, 0.3)'
                    }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mx: 'auto', mb: 1 }}>
                          <TimeIcon />
                        </Avatar>
                        <Typography variant="h4" fontWeight="bold">
                          {workouts.reduce((sum, w) => sum + w.durationInMinutes, 0)}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Total Minutes
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                      background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', 
                      color: 'white',
                      borderRadius: 3,
                      boxShadow: '0 8px 32px rgba(137, 247, 254, 0.3)'
                    }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mx: 'auto', mb: 1 }}>
                          <TrophyIcon />
                        </Avatar>
                        <Typography variant="h4" fontWeight="bold">
                          {workouts.filter(w => w.completed).length}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Completed
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Workout Cards */}
                <Grid container spacing={3}>
                  {workouts.length === 0 ? (
                    <Grid item xs={12}>
                      <Paper sx={{ 
                        p: 4, 
                        textAlign: 'center', 
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                      }}>
                        <FitnessCenterIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No workouts found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Start your fitness journey by adding your first workout!
                        </Typography>
                        <Button 
                          variant="contained" 
                          startIcon={<AddIcon />}
                          onClick={() => setTabValue(1)}
                          sx={{ 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: 2
                          }}
                        >
                          Add Your First Workout
                        </Button>
                      </Paper>
                    </Grid>
                  ) : (
                    workouts.map((workout, idx) => (
                      <Grid item xs={12} lg={6} key={workout._id || idx}>
                        <Card elevation={0} sx={{ 
                          borderRadius: 3, 
                          mb: 2,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          position: 'relative',
                          overflow: 'hidden',
                          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
                        }}>
                          <CardContent sx={{ p: 3 }}>
                            {/* Header with status badge */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FitnessCenterIcon sx={{ fontSize: 28 }} />
                                <Typography variant="h6" fontWeight={700}>
                                  {workout.title}
                                </Typography>
                              </Box>
                              <Chip 
                                label={workout.completed ? 'Completed' : 'Pending'}
                                size="small"
                                sx={{ 
                                  bgcolor: workout.completed ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 193, 7, 0.2)',
                                  color: 'white',
                                  fontWeight: 600
                                }}
                                icon={workout.completed ? <StarIcon /> : <ScheduleIcon />}
                              />
                            </Box>

                            {/* Schedule info */}
                            {workout.scheduledTime && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, opacity: 0.9 }}>
                                <CalendarIcon fontSize="small" />
                                <Typography variant="body2">
                                  {new Date(workout.scheduledTime).toLocaleString()}
                                </Typography>
                              </Box>
                            )}

                            <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />

                            {/* Exercises */}
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, opacity: 0.9 }}>
                                Exercises ({workout.exercises.length})
                              </Typography>
                              <Stack spacing={1}>
                                {workout.exercises.slice(0, 3).map((ex: any, i: number) => (
                                  <Box key={i} sx={{ 
                                    p: 1.5, 
                                    bgcolor: 'rgba(255,255,255,0.1)', 
                                    borderRadius: 2,
                                    backdropFilter: 'blur(10px)'
                                  }}>
                                    <Typography variant="body2" fontWeight={500}>
                                      {ex.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                      {ex.sets} sets × {ex.reps} reps {ex.weight > 0 && `@ ${ex.weight}kg`}
                                    </Typography>
                                  </Box>
                                ))}
                                {workout.exercises.length > 3 && (
                                  <Typography variant="caption" sx={{ opacity: 0.7, textAlign: 'center' }}>
                                    +{workout.exercises.length - 3} more exercises
                                  </Typography>
                                )}
                              </Stack>
                            </Box>

                            <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />

                            {/* Stats */}
                            <Grid container spacing={2}>
                              <Grid item xs={4}>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="h6" fontWeight={700}>
                                    {workout.caloriesBurned}
                                  </Typography>
                                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                    Calories
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={4}>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="h6" fontWeight={700}>
                                    {workout.durationInMinutes}
                                  </Typography>
                                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                    Minutes
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={4}>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="h6" fontWeight={700}>
                                    {workout.exercises.length}
                                  </Typography>
                                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                    Exercises
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>

                            {/* Action button */}
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<PlayIcon />}
                                sx={{ 
                                  bgcolor: 'rgba(255,255,255,0.2)', 
                                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                                  backdropFilter: 'blur(10px)',
                                  border: '1px solid rgba(255,255,255,0.1)'
                                }}
                              >
                                {workout.completed ? 'View Details' : 'Start Workout'}
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  )}
                </Grid>
              </>
            );
          })()}
        </TabPanel>
        {/* Add Workout Tab */}
        <TabPanel value={tabValue} index={1}>
          {/* AI Suggest Workout Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Button 
              variant="contained" 
              onClick={handleAiSuggest} 
              disabled={aiLoading} 
              startIcon={<AiIcon />}
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 2,
                px: 3,
                fontWeight: 600
              }}
            >
              {aiLoading ? '🤖 Thinking...' : '✨ AI Suggest Workout'}
            </Button>
          </Box>

          {/* AI Suggestion Modal */}
          {aiSuggestOpen && aiSuggestion && (
            <Card sx={{ 
              mb: 3, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <AiIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      🤖 AI Suggested Workout
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Personalized recommendation based on your fitness level
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(255,255,255,0.1)', 
                  borderRadius: 2, 
                  mb: 2,
                  backdropFilter: 'blur(10px)'
                }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                    {aiSuggestion.title}
                  </Typography>
                  <Grid container spacing={2}>
                    {aiSuggestion.exercises.map((ex: any, i: number) => (
                      <Grid item xs={12} sm={6} key={i}>
                        <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                          <Typography variant="body2" fontWeight={500}>
                            {ex.name}
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            {ex.sets} sets × {ex.reps} reps {ex.weight ? `@ ${ex.weight}kg` : ''}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip 
                      icon={<FireIcon />} 
                      label={`${aiSuggestion.caloriesBurned} calories`}
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                    <Chip 
                      icon={<TimeIcon />} 
                      label={`${aiSuggestion.durationInMinutes} minutes`}
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button 
                    variant="contained" 
                    onClick={handleAcceptSuggestion}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    ✨ Accept Suggestion
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => setAiSuggestOpen(false)}
                    sx={{ 
                      borderColor: 'rgba(255,255,255,0.3)', 
                      color: 'white',
                      '&:hover': { borderColor: 'rgba(255,255,255,0.5)' }
                    }}
                  >
                    Close
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Workout Creation Form */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <AddIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    Create New Workout
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Design your perfect training session
                  </Typography>
                </Box>
              </Box>

              <Box component="form" onSubmit={handleCreateWorkout}>
                <TextField
                  label="Workout Title"
                  name="title"
                  value={newWorkout.title}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  sx={{ mb: 3 }}
                  variant="outlined"
                  placeholder="e.g., Morning Strength Training"
                />

                {/* Exercises Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FitnessCenterIcon color="primary" />
                    Exercises
                  </Typography>
                  
                  <Stack spacing={2}>
                    {newWorkout.exercises.map((ex, idx) => (
                      <Paper key={idx} sx={{ 
                        p: 3, 
                        borderRadius: 2, 
                        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                        position: 'relative'
                      }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={4}>
                            <TextField
                              label="Exercise Name"
                              value={ex.name}
                              onChange={e => handleExerciseChange(idx, 'name', e.target.value)}
                              fullWidth
                              required
                              placeholder="e.g., Push-ups"
                            />
                          </Grid>
                          <Grid item xs={4} sm={2}>
                            <TextField
                              label="Sets"
                              type="number"
                              value={ex.sets}
                              onChange={e => handleExerciseChange(idx, 'sets', Number(e.target.value))}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={4} sm={2}>
                            <TextField
                              label="Reps"
                              type="number"
                              value={ex.reps}
                              onChange={e => handleExerciseChange(idx, 'reps', Number(e.target.value))}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={4} sm={2}>
                            <TextField
                              label="Weight (kg)"
                              type="number"
                              value={ex.weight}
                              onChange={e => handleExerciseChange(idx, 'weight', Number(e.target.value))}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <IconButton 
                              color="error" 
                              onClick={() => removeExerciseField(idx)} 
                              disabled={newWorkout.exercises.length === 1}
                              sx={{ 
                                bgcolor: newWorkout.exercises.length > 1 ? 'error.light' : 'grey.300',
                                color: 'white',
                                '&:hover': { bgcolor: 'error.main' }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Paper>
                    ))}
                  </Stack>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button 
                      startIcon={<AddIcon />} 
                      onClick={addExerciseField}
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    >
                      Add Exercise
                    </Button>
                  </Box>
                </Box>

                {/* Schedule and Metrics */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Scheduled Time"
                      name="scheduledTime"
                      type="datetime-local"
                      value={newWorkout.scheduledTime}
                      onChange={handleInputChange}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Duration (minutes)"
                      name="durationInMinutes"
                      type="number"
                      value={newWorkout.durationInMinutes}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Estimated Calories Burned"
                      name="caloriesBurned"
                      type="number"
                      value={newWorkout.caloriesBurned}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth 
                  size="large" 
                  sx={{ 
                    mt: 2,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '1.1rem'
                  }}
                >
                  🚀 Create Workout
                </Button>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            {/* Analytics Overview Cards */}
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                borderRadius: 3, 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                height: '100%'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                      <FireIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        7,450
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Total Calories Burned
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    +15% from last month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ 
                borderRadius: 3, 
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                color: 'white',
                height: '100%'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                      <TimeIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        1,280
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Total Minutes
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    +8% from last month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ 
                borderRadius: 3, 
                background: 'linear-gradient(135deg, #4ecdc4 0%, #26a69a 100%)',
                color: 'white',
                height: '100%'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                      <TargetIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        24
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Total Workouts
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    This month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Workout Type Distribution */}
            <Grid item xs={12} lg={6}>
              <Card sx={{ 
                borderRadius: 3, 
                height: 400, 
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)' 
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <PieChartIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        Workout Distribution
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        By exercise type
                      </Typography>
                    </Box>
                  </Box>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={workoutTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {workoutTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Percentage']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                    {workoutTypeData.map((entry) => (
                      <Chip
                        key={entry.name}
                        icon={<Box
                          sx={{
                            width: 8,
                            height: 8,
                            backgroundColor: entry.color,
                            borderRadius: '50%'
                          }}
                        />}
                        label={`${entry.name}: ${entry.value}%`}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Monthly Progress Chart */}
            <Grid item xs={12} lg={6}>
              <Card sx={{ 
                borderRadius: 3, 
                height: 400, 
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)' 
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <TrendingUpIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        Monthly Progress
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Calories burned over time
                      </Typography>
                    </Box>
                  </Box>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={monthlyProgressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="calories" fill="#667eea" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Weekly Activity Chart */}
            <Grid item xs={12}>
              <Card sx={{ 
                borderRadius: 3, 
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)' 
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'info.main' }}>
                      <ShowChartIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        Weekly Activity Trend
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Workout intensity and frequency
                      </Typography>
                    </Box>
                  </Box>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="workouts" 
                        stroke="#667eea" 
                        strokeWidth={3}
                        dot={{ fill: '#667eea', strokeWidth: 2, r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="calories" 
                        stroke="#ff6b6b" 
                        strokeWidth={3}
                        dot={{ fill: '#ff6b6b', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Personal Records */}
            <Grid item xs={12}>
              <Card sx={{ 
                borderRadius: 3, 
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)' 
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      <EmojiEventsIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        Personal Records
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Your best achievements
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Grid container spacing={2}>
                    {[
                      { exercise: 'Bench Press', weight: '85kg', date: '2024-01-15', improvement: '+5kg' },
                      { exercise: 'Squat', weight: '120kg', date: '2024-01-12', improvement: '+10kg' },
                      { exercise: 'Deadlift', weight: '140kg', date: '2024-01-10', improvement: '+15kg' },
                      { exercise: 'Pull-ups', reps: '15 reps', date: '2024-01-08', improvement: '+3 reps' }
                    ].map((record, idx) => (
                      <Grid item xs={12} sm={6} md={3} key={idx}>
                        <Paper sx={{ 
                          p: 2, 
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          color: 'white',
                          textAlign: 'center'
                        }}>
                          <Typography variant="h6" fontWeight={700}>
                            {record.weight || record.reps}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                            {record.exercise}
                          </Typography>
                          <Chip 
                            label={record.improvement}
                            size="small"
                            sx={{ 
                              bgcolor: 'rgba(255,255,255,0.2)', 
                              color: 'white',
                              fontSize: '0.75rem'
                            }}
                          />
                          <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.8 }}>
                            {new Date(record.date).toLocaleDateString()}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        
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

export default WorkoutTracker;
