import React, { useState, useEffect } from 'react';
import {
  InputLabel,
  Select,
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  Avatar,
  CircularProgress,
  Alert,
  Snackbar,
  Stack,
  Divider,
  FormControl,
  MenuItem,
  SelectChangeEvent,
  Card,
  CardContent,
  Chip
} 
from '@mui/material';
import {
  Person as PersonIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Email as EmailIcon,
  Height as HeightIcon,
  MonitorWeight as WeightIcon,
  Cake as AgeIcon,
  Wc as GenderIcon,
  EmojiEvents as TrophyIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import DashboardLayout from '../components/DashboardLayout';
import { authService, UpdateProfileData } from '../services/authService';

interface ProfileProps {
  setAppMode?: (mode: 'light' | 'dark') => void;
  appMode?: 'light' | 'dark';
}

const Profile: React.FC<ProfileProps> = ({ setAppMode, appMode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileData>({});
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const userData = await authService.getProfile();
        setUser(userData);
        // Set formData with user data or sample data for demonstration
        setFormData({
          name: userData.name || 'John Doe',
          email: userData.email || 'john.doe@example.com',
          age: userData.age || 25,
          weight: userData.weight || 70,
          height: userData.height || 175,
          gender: (userData.gender as 'Male' | 'Female' | 'Other' | undefined) || 'Male',
        });
      } catch (error) {
        console.error('Error loading user profile:', error);
        setError('Failed to load user profile. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const name = e.target.name as keyof UpdateProfileData;
    const value = e.target.value;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const name = event.target.name as keyof UpdateProfileData;
    const value = event.target.value;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    setIsLoading(true);
    try {
      const updateData: UpdateProfileData = {
        ...formData,
        email: formData.email ?? user?.email
      };
      const updatedUser = await authService.updateProfile(updateData);
      setUser(updatedUser);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSuccessMessage(null);
  };

  if (isLoading && !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
        {/* Modern Profile Header with Gradient */}
        <Card sx={{ 
          borderRadius: 4, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          mb: 4,
          overflow: 'hidden',
          position: 'relative'
        }}>
          <CardContent sx={{ p: 4, position: 'relative', zIndex: 2 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar sx={{ 
                  width: 100, 
                  height: 100,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  border: '4px solid rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <PersonIcon sx={{ fontSize: 50 }} />
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h3" fontWeight={800} gutterBottom>
                  {user?.name || 'Your Profile'}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                  {user?.email}
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  {user?.age && (
                    <Chip 
                      icon={<AgeIcon />}
                      label={`${user.age} years old`}
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        color: 'white',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                  )}
                  {user?.weight && (
                    <Chip 
                      icon={<WeightIcon />}
                      label={`${user.weight} kg`}
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        color: 'white',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                  )}
                  {user?.height && (
                    <Chip 
                      icon={<HeightIcon />}
                      label={`${user.height} cm`}
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        color: 'white',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                  )}
                </Stack>
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                    onClick={isEditing ? handleSubmit : () => setIsEditing(true)}
                    disabled={isLoading}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                    }}
                  >
                    {isEditing ? 'Save Profile' : 'Edit Profile'}
                  </Button>
                  {isEditing && (
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={() => setIsEditing(false)}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.3)',
                        color: 'white',
                        '&:hover': { borderColor: 'rgba(255,255,255,0.5)' }
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
          
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
        </Card>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              '& .MuiAlert-icon': { fontSize: '1.5rem' }
            }}
          >
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Personal Information Card */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              height: 'fit-content'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={700}>
                      Personal Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Keep your profile information up to date
                    </Typography>
                  </Box>
                </Box>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                        <PersonIcon sx={{ color: 'text.secondary', mb: 0.5 }} />
                        <TextField
                          label="Full Name"
                          name="name"
                          value={formData.name || ''}
                          onChange={handleFormChange}
                          fullWidth
                          required
                          disabled={!isEditing}
                          variant="outlined"
                          sx={{ 
                            '& .MuiOutlinedInput-root': { 
                              borderRadius: 2,
                              '&.Mui-focused fieldset': {
                                borderColor: 'primary.main'
                              }
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                        <EmailIcon sx={{ color: 'text.secondary', mb: 0.5 }} />
                        <TextField
                          label="Email Address"
                          name="email"
                          value={formData.email || ''}
                          onChange={handleFormChange}
                          fullWidth
                          required
                          disabled
                          variant="outlined"
                          sx={{ 
                            '& .MuiOutlinedInput-root': { 
                              borderRadius: 2 
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                        <AgeIcon sx={{ color: 'text.secondary', mb: 0.5 }} />
                        <TextField
                          label="Age"
                          name="age"
                          type="number"
                          value={formData.age || ''}
                          onChange={handleFormChange}
                          fullWidth
                          disabled={!isEditing}
                          variant="outlined"
                          sx={{ 
                            '& .MuiOutlinedInput-root': { 
                              borderRadius: 2 
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                        <WeightIcon sx={{ color: 'text.secondary', mb: 0.5 }} />
                        <TextField
                          label="Weight (kg)"
                          name="weight"
                          type="number"
                          value={formData.weight || ''}
                          onChange={handleFormChange}
                          fullWidth
                          disabled={!isEditing}
                          variant="outlined"
                          sx={{ 
                            '& .MuiOutlinedInput-root': { 
                              borderRadius: 2 
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                        <HeightIcon sx={{ color: 'text.secondary', mb: 0.5 }} />
                        <TextField
                          label="Height (cm)"
                          name="height"
                          type="number"
                          value={formData.height || ''}
                          onChange={handleFormChange}
                          fullWidth
                          disabled={!isEditing}
                          variant="outlined"
                          sx={{ 
                            '& .MuiOutlinedInput-root': { 
                              borderRadius: 2 
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                        <GenderIcon sx={{ color: 'text.secondary', mb: 0.5 }} />
                        <FormControl fullWidth disabled={!isEditing}>
                          <InputLabel id="gender-label">Gender</InputLabel>
                          <Select
                            labelId="gender-label"
                            name="gender"
                            value={formData.gender || ''}
                            label="Gender"
                            onChange={handleSelectChange}
                            variant="outlined"
                            sx={{ 
                              borderRadius: 2,
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderRadius: 2
                              }
                            }}
                          >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Stats & Actions */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              {/* BMI Card */}
              {user?.weight && user?.height && (
                <Card sx={{ 
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #4ecdc4 0%, #26a69a 100%)',
                  color: 'white'
                }}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight={700} mb={1}>
                      {((user.weight / ((user.height / 100) ** 2)).toFixed(1))}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Body Mass Index
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                      {(() => {
                        const bmi = user.weight / ((user.height / 100) ** 2);
                        if (bmi < 18.5) return 'Underweight';
                        if (bmi < 25) return 'Normal weight';
                        if (bmi < 30) return 'Overweight';
                        return 'Obese';
                      })()}
                    </Typography>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} mb={2}>
                    Quick Actions
                  </Typography>
                  <Stack spacing={2}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<ShareIcon />}
                      sx={{ borderRadius: 2, justifyContent: 'flex-start' }}
                    >
                      Share Progress
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<TrophyIcon />}
                      sx={{ borderRadius: 2, justifyContent: 'flex-start' }}
                    >
                      View Achievements
                    </Button>
                    <Divider />
                    <Button
                      variant="outlined"
                      fullWidth
                      color="error"
                      startIcon={<LogoutIcon />}
                      onClick={() => {
                        authService.logout();
                        window.location.href = '/';
                      }}
                      sx={{ borderRadius: 2, justifyContent: 'flex-start' }}
                    >
                      Sign Out
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>

        {/* Success Snackbar */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            severity="success" 
            onClose={handleSnackbarClose} 
            sx={{ 
              width: '100%',
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)'
            }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
};

export default Profile;

