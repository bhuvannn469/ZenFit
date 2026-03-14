import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Stack, 
  Card, 
  CardContent, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip,
  Divider,
  Alert,
  LinearProgress,
  SelectChangeEvent
} from '@mui/material';
import DashboardLayout from '../components/DashboardLayout';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TargetIcon from '@mui/icons-material/GpsFixed';
import LevelIcon from '@mui/icons-material/TrendingUp';

interface WorkoutPlan {
  id: string;
  name: string;
  duration: string;
  level: string;
  focus: string;
  exercises: Array<{
    name: string;
    sets: number;
    reps: string;
    rest: string;
  }>;
}

const PersonalizedWorkout: React.FC = () => {
  const [fitnessLevel, setFitnessLevel] = useState<string>('');
  const [workoutGoal, setWorkoutGoal] = useState<string>('');
  const [availableTime, setAvailableTime] = useState<string>('');
  const [equipment, setEquipment] = useState<string>('');
  const [generatedPlan, setGeneratedPlan] = useState<WorkoutPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const samplePlans: WorkoutPlan[] = [
    {
      id: '1',
      name: 'Beginner Full Body',
      duration: '30 minutes',
      level: 'Beginner',
      focus: 'Strength Building',
      exercises: [
        { name: 'Push-ups', sets: 3, reps: '8-12', rest: '60s' },
        { name: 'Squats', sets: 3, reps: '10-15', rest: '60s' },
        { name: 'Plank', sets: 3, reps: '30-45s', rest: '45s' },
        { name: 'Lunges', sets: 3, reps: '8-10 each leg', rest: '60s' }
      ]
    }
  ];

  const handleOpenMuscleWiki = () => {
    window.open('https://musclewiki.com/', '_blank');
  };

  const generateWorkoutPlan = () => {
    if (!fitnessLevel || !workoutGoal || !availableTime) {
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedPlan(samplePlans[0]);
      setIsGenerating(false);
    }, 2000);
  };

  const handleLevelChange = (event: SelectChangeEvent) => {
    setFitnessLevel(event.target.value);
  };

  const handleGoalChange = (event: SelectChangeEvent) => {
    setWorkoutGoal(event.target.value);
  };

  const handleTimeChange = (event: SelectChangeEvent) => {
    setAvailableTime(event.target.value);
  };

  const handleEquipmentChange = (event: SelectChangeEvent) => {
    setEquipment(event.target.value);
  };

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 1000, mx: 'auto', width: '100%', p: 2 }}>
        <Typography variant="h4" fontWeight="bold" color="primary.main" mb={1}>
          Personalized Workout Plans
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Get customized workout plans tailored to your fitness level, goals, and available time
        </Typography>

        <Grid container spacing={4}>
          {/* Workout Plan Generator */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Create Your Custom Plan
                </Typography>
                
                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <InputLabel>Fitness Level</InputLabel>
                    <Select
                      value={fitnessLevel}
                      label="Fitness Level"
                      onChange={handleLevelChange}
                    >
                      <MenuItem value="beginner">Beginner</MenuItem>
                      <MenuItem value="intermediate">Intermediate</MenuItem>
                      <MenuItem value="advanced">Advanced</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Primary Goal</InputLabel>
                    <Select
                      value={workoutGoal}
                      label="Primary Goal"
                      onChange={handleGoalChange}
                    >
                      <MenuItem value="weight-loss">Weight Loss</MenuItem>
                      <MenuItem value="muscle-gain">Muscle Gain</MenuItem>
                      <MenuItem value="strength">Build Strength</MenuItem>
                      <MenuItem value="endurance">Improve Endurance</MenuItem>
                      <MenuItem value="general">General Fitness</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Available Time</InputLabel>
                    <Select
                      value={availableTime}
                      label="Available Time"
                      onChange={handleTimeChange}
                    >
                      <MenuItem value="15-20">15-20 minutes</MenuItem>
                      <MenuItem value="30-45">30-45 minutes</MenuItem>
                      <MenuItem value="60">1 hour</MenuItem>
                      <MenuItem value="90+">90+ minutes</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Equipment Available</InputLabel>
                    <Select
                      value={equipment}
                      label="Equipment Available"
                      onChange={handleEquipmentChange}
                    >
                      <MenuItem value="none">No Equipment (Bodyweight)</MenuItem>
                      <MenuItem value="basic">Basic (Dumbbells, Resistance Bands)</MenuItem>
                      <MenuItem value="gym">Full Gym Access</MenuItem>
                      <MenuItem value="home-gym">Home Gym Setup</MenuItem>
                    </Select>
                  </FormControl>

                  <Button
                    variant="contained"
                    size="large"
                    onClick={generateWorkoutPlan}
                    disabled={!fitnessLevel || !workoutGoal || !availableTime || isGenerating}
                    startIcon={<FitnessCenterIcon />}
                    sx={{ mt: 2 }}
                  >
                    {isGenerating ? 'Generating Plan...' : 'Generate Workout Plan'}
                  </Button>

                  {isGenerating && (
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress />
                      <Typography variant="body2" textAlign="center" mt={1} color="text.secondary">
                        Creating your personalized workout plan...
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Generated Plan or Quick Access */}
          <Grid item xs={12} lg={6}>
            {generatedPlan ? (
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FitnessCenterIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight="bold">
                      {generatedPlan.name}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1} mb={2}>
                    <Chip
                      icon={<AccessTimeIcon />}
                      label={generatedPlan.duration}
                      size="small"
                      color="primary"
                    />
                    <Chip
                      icon={<LevelIcon />}
                      label={generatedPlan.level}
                      size="small"
                      color="secondary"
                    />
                    <Chip
                      icon={<TargetIcon />}
                      label={generatedPlan.focus}
                      size="small"
                      color="success"
                    />
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                    Exercise Plan:
                  </Typography>

                  <Stack spacing={2}>
                    {generatedPlan.exercises.map((exercise, index) => (
                      <Card key={`exercise-${exercise.name}-${index}`} variant="outlined">
                        <CardContent sx={{ py: 2 }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {exercise.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {exercise.sets} sets × {exercise.reps} • Rest: {exercise.rest}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>

                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={() => setGeneratedPlan(null)}
                  >
                    Generate New Plan
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Quick Resources
                  </Typography>
                  
                  <Stack spacing={2}>
                    <Alert severity="info">
                      Fill out the form to generate a personalized workout plan tailored to your needs.
                    </Alert>

                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={handleOpenMuscleWiki}
                      startIcon={<FitnessCenterIcon />}
                    >
                      Browse Exercise Library (MuscleWiki)
                    </Button>

                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                          Popular Workout Types:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          <Chip label="HIIT" size="small" />
                          <Chip label="Strength Training" size="small" />
                          <Chip label="Cardio" size="small" />
                          <Chip label="Yoga" size="small" />
                          <Chip label="Pilates" size="small" />
                          <Chip label="Bodyweight" size="small" />
                        </Box>
                      </CardContent>
                    </Card>
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default PersonalizedWorkout;
