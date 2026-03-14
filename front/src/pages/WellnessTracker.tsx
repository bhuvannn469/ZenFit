
import React, { useState, useCallback } from 'react';
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Tab,
  Alert,
  Snackbar,
  Avatar,
  Grid,
  Stack,
  Tabs,
  Chip,
  LinearProgress,
  Paper
} from '@mui/material';
import {
  Spa as SpaIcon,
  Bedtime as BedtimeIcon,
  SelfImprovement as MeditationIcon,
  AccessTime as TimeIcon,
  Psychology as PsychologyIcon,
  FavoriteRounded as HeartIcon
} from '@mui/icons-material';
import DashboardLayout from '../components/DashboardLayout';
import { SleepEntry, MoodEntry, MeditationSession } from '../services/wellnessService';


const MoodIcons: Record<number, string> = {
  1: '😢',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😄',
};

const SleepQualityIcons: Record<number, string> = {
  1: '😴',
  2: '🥱',
  3: '😌',
  4: '😊',
  5: '✨',
};

// Helper icon components - Updated with modern emoji sets
function SleepIcon({ quality }: Readonly<{ quality: number }>) {
  return <span style={{ fontSize: 24 }}>{SleepQualityIcons[quality]}</span>;
}

function MoodIconComponent({ rating }: Readonly<{ rating: number }>) {
  return <span style={{ fontSize: 24 }}>{MoodIcons[rating]}</span>;
}

function MeditationIconComponent() {
  return <span style={{ fontSize: 24 }}>🧘‍♂️</span>;
}



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
      id={`wellness-tabpanel-${index}`}
      aria-labelledby={`wellness-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const INITIAL = {
  sleep: [
    { id: '1', date: '2025-06-14', hoursSlept: 7.5, quality: 4, notes: 'Went to bed early' },
    { id: '2', date: '2025-06-13', hoursSlept: 6, quality: 3, notes: 'Woke up once' },
    { id: '3', date: '2025-06-12', hoursSlept: 8, quality: 5, notes: 'Great sleep' },
  ],
  mood: [
    { id: '1', date: '2025-06-14', moodRating: 4, energyLevel: 3, stressLevel: 2, notes: 'Feeling good today' },
    { id: '2', date: '2025-06-13', moodRating: 3, energyLevel: 2, stressLevel: 3, notes: 'Stressful work day' },
    { id: '3', date: '2025-06-12', moodRating: 5, energyLevel: 5, stressLevel: 1, notes: 'Great day' },
  ],
  meditation: [
    { id: '1', date: '2025-06-14', duration: 15, type: 'Mindfulness', notes: 'Morning session' },
    { id: '2', date: '2025-06-13', duration: 10, type: 'Breathing', notes: 'Before bed' },
  ],
};

const WellnessTracker: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  // Removed unused loading and error state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [entries, setEntries] = useState(INITIAL);

  // Add entry handlers
  type EntryType = 'sleep' | 'mood' | 'meditation';
  const addEntry = useCallback((type: EntryType) => {
    const now = new Date().toISOString().split('T')[0];
    let newEntry: SleepEntry | MoodEntry | MeditationSession;
    if (type === 'sleep') {
      newEntry = { id: Date.now().toString(), date: now, hoursSlept: 8, quality: 4, notes: '' } as SleepEntry;
    } else if (type === 'mood') {
      newEntry = { id: Date.now().toString(), date: now, moodRating: 3, energyLevel: 3, stressLevel: 3, notes: '' } as MoodEntry;
    } else {
      newEntry = { id: Date.now().toString(), date: now, duration: 10, type: 'Mindfulness', notes: '' } as MeditationSession;
    }
    setEntries(prev => ({ ...prev, [type]: [newEntry, ...prev[type]] }));
    setSuccessMessage(type.charAt(0).toUpperCase() + type.slice(1) + ' entry added!');
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };



  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
        {/* Modern Header with Gradient */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 4,
          p: 4,
          mb: 4,
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Stack direction="row" alignItems="center" spacing={3} mb={3}>
              <Avatar sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                width: 72, 
                height: 72,
                backdropFilter: 'blur(10px)'
              }}>
                <SpaIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Box flex={1}>
                <Typography variant="h3" fontWeight={800} gutterBottom sx={{ mb: 1 }}>
                  Wellness Hub
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                  Your holistic wellness journey - track sleep, mood, and mindfulness
                </Typography>
              </Box>
            </Stack>

            {/* Quick Stats Cards */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ 
                  p: 2, 
                  background: 'rgba(255,255,255,0.1)', 
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  color: 'white'
                }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                      <BedtimeIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h5" fontWeight={700}>
                        {(entries.sleep.reduce((sum, entry) => sum + entry.hoursSlept, 0) / (entries.sleep.length || 1)).toFixed(1)}h
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Avg Sleep
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Paper sx={{ 
                  p: 2, 
                  background: 'rgba(255,255,255,0.1)', 
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  color: 'white'
                }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                      <HeartIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h5" fontWeight={700}>
                        {(entries.mood.reduce((sum, entry) => sum + entry.moodRating, 0) / (entries.mood.length || 1)).toFixed(1)}/5
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Avg Mood
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Paper sx={{ 
                  p: 2, 
                  background: 'rgba(255,255,255,0.1)', 
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  color: 'white'
                }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                      <MeditationIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h5" fontWeight={700}>
                        {entries.meditation.reduce((sum, entry) => sum + entry.duration, 0)}min
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Total Meditation
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Box>
          
          {/* Decorative background elements */}
          <Box sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            opacity: 0.5,
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            opacity: 0.3,
          }} />
        </Box>

        {/* Modern Tabs */}
        <Card sx={{ 
          borderRadius: 3, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
          mb: 3,
          overflow: 'visible'
        }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth"
            sx={{ 
              '& .MuiTab-root': {
                fontSize: '1rem',
                fontWeight: 600,
                py: 2,
                textTransform: 'none',
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: '8px 8px 0 0',
                }
              }
            }}
          >
            <Tab 
              icon={<BedtimeIcon />} 
              label="Sleep Tracking" 
              iconPosition="start"
            />
            <Tab 
              icon={<PsychologyIcon />} 
              label="Mood Journal" 
              iconPosition="start"
            />
            <Tab 
              icon={<MeditationIcon />} 
              label="Meditation" 
              iconPosition="start"
            />
          </Tabs>
        </Card>
        {/* Sleep Tracking Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3 }}>
            <Button 
              variant="contained" 
              startIcon={<BedtimeIcon />}
              onClick={() => addEntry('sleep')}
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                mb: 3
              }}
            >
              ✨ Log Sleep Entry
            </Button>
          </Box>

          <Grid container spacing={3}>
            {entries.sleep.length === 0 ? (
              <Grid item xs={12}>
                <Card sx={{ 
                  borderRadius: 3, 
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  textAlign: 'center',
                  p: 4
                }}>
                  <BedtimeIcon sx={{ fontSize: 64, mb: 2, opacity: 0.8 }} />
                  <Typography variant="h6" fontWeight={600} mb={1}>
                    No sleep entries yet
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Start tracking your sleep patterns for better rest
                  </Typography>
                </Card>
              </Grid>
            ) : entries.sleep.map((entry) => (
              <Grid item xs={12} sm={6} md={4} key={entry.id}>
                <Card sx={{ 
                  borderRadius: 3, 
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  height: '100%',
                  transition: 'transform 0.3s ease, boxShadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                      <Avatar sx={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        width: 48,
                        height: 48
                      }}>
                        <span style={{ fontSize: 24 }}>{SleepQualityIcons[entry.quality]}</span>
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6" fontWeight={700} color="primary">
                          Sleep Session
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(entry.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </Typography>
                      </Box>
                    </Stack>
                    
                    <Stack spacing={2}>
                      <Box sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                      }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="body2" fontWeight={600} color="text.secondary">
                            Duration
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <TimeIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                            <Typography variant="h6" fontWeight={700} color="primary.main">
                              {entry.hoursSlept}h
                            </Typography>
                          </Stack>
                        </Stack>
                        
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" fontWeight={600} color="text.secondary">
                            Quality
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={(entry.quality / 5) * 100} 
                              sx={{ 
                                width: 60, 
                                height: 8, 
                                borderRadius: 4,
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                '& .MuiLinearProgress-bar': {
                                  borderRadius: 4,
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                }
                              }}
                            />
                            <Typography variant="body2" fontWeight={700}>
                              {entry.quality}/5
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                      
                      {entry.notes && (
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            "{entry.notes}"
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Mood Journal Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 3 }}>
            <Button 
              variant="contained" 
              startIcon={<PsychologyIcon />}
              onClick={() => addEntry('mood')}
              sx={{ 
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                mb: 3
              }}
            >
              💭 Record Mood
            </Button>
          </Box>

          <Grid container spacing={3}>
            {entries.mood.length === 0 ? (
              <Grid item xs={12}>
                <Card sx={{ 
                  borderRadius: 3, 
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                  color: 'white',
                  textAlign: 'center',
                  p: 4
                }}>
                  <PsychologyIcon sx={{ fontSize: 64, mb: 2, opacity: 0.8 }} />
                  <Typography variant="h6" fontWeight={600} mb={1}>
                    No mood entries yet
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Start journaling your emotions and energy levels
                  </Typography>
                </Card>
              </Grid>
            ) : entries.mood.map((entry) => (
              <Grid item xs={12} sm={6} md={4} key={entry.id}>
                <Card sx={{ 
                  borderRadius: 3, 
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  height: '100%',
                  transition: 'transform 0.3s ease, boxShadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                      <Avatar sx={{ 
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                        width: 48,
                        height: 48
                      }}>
                        <span style={{ fontSize: 24 }}>{MoodIcons[entry.moodRating]}</span>
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6" fontWeight={700} color="primary">
                          Mood Check-in
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(entry.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </Typography>
                      </Box>
                    </Stack>
                    
                    <Stack spacing={2}>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: 'primary.light', color: 'white' }}>
                            <Typography variant="h6" fontWeight={700}>
                              {entry.moodRating}
                            </Typography>
                            <Typography variant="caption">
                              Mood
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: 'success.light', color: 'white' }}>
                            <Typography variant="h6" fontWeight={700}>
                              {entry.energyLevel}
                            </Typography>
                            <Typography variant="caption">
                              Energy
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: 'warning.light', color: 'white' }}>
                            <Typography variant="h6" fontWeight={700}>
                              {entry.stressLevel}
                            </Typography>
                            <Typography variant="caption">
                              Stress
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      
                      {entry.notes && (
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            "{entry.notes}"
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Meditation Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ mb: 3 }}>
            <Button 
              variant="contained" 
              startIcon={<MeditationIcon />}
              onClick={() => addEntry('meditation')}
              sx={{ 
                background: 'linear-gradient(135deg, #4ecdc4 0%, #26a69a 100%)',
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                mb: 3
              }}
            >
              🧘‍♂️ Start Session
            </Button>
          </Box>

          <Grid container spacing={3}>
            {entries.meditation.length === 0 ? (
              <Grid item xs={12}>
                <Card sx={{ 
                  borderRadius: 3, 
                  background: 'linear-gradient(135deg, #4ecdc4 0%, #26a69a 100%)',
                  color: 'white',
                  textAlign: 'center',
                  p: 4
                }}>
                  <MeditationIcon sx={{ fontSize: 64, mb: 2, opacity: 0.8 }} />
                  <Typography variant="h6" fontWeight={600} mb={1}>
                    No meditation sessions yet
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Begin your mindfulness journey today
                  </Typography>
                </Card>
              </Grid>
            ) : entries.meditation.map((entry) => (
              <Grid item xs={12} sm={6} md={4} key={entry.id}>
                <Card sx={{ 
                  borderRadius: 3, 
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  height: '100%',
                  transition: 'transform 0.3s ease, boxShadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                      <Avatar sx={{ 
                        background: 'linear-gradient(135deg, #4ecdc4 0%, #26a69a 100%)',
                        width: 48,
                        height: 48
                      }}>
                        <MeditationIcon />
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6" fontWeight={700} color="primary">
                          Meditation Session
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(entry.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </Typography>
                      </Box>
                    </Stack>
                    
                    <Stack spacing={2}>
                      <Stack direction="row" spacing={2}>
                        <Chip 
                          icon={<TimeIcon />}
                          label={`${entry.duration} min`}
                          sx={{ 
                            background: 'linear-gradient(135deg, #4ecdc4 0%, #26a69a 100%)',
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                        <Chip 
                          label={entry.type}
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                      </Stack>
                      
                      {entry.notes && (
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            "{entry.notes}"
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
        <Snackbar
          open={!!successMessage}
          autoHideDuration={4000}
          onClose={() => setSuccessMessage(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" onClose={() => setSuccessMessage(null)} sx={{ width: '100%' }}>
            {successMessage}
          </Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
};

export default WellnessTracker;
