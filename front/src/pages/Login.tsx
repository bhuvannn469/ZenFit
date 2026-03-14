import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,

  Card
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService, LoginData } from '../services/authService';

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/home');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await authService.login(formData);
      navigate('/home');
    } catch (error: any) {
      setError(error?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container disableGutters maxWidth={false}
      sx={{
        minHeight: '100vh',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.92), rgba(0, 0, 0, 0.92)), url(https://images.unsplash.com/photo-1517960413843-0aee8e2d471c?auto=format&fit=crop&w=800&q=80)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        boxShadow: 'none',
        overflowY: 'auto',
        py: 4,
      }}
    >
      <Box sx={{ maxWidth: '400px', margin: '0 auto' }}>
        <Card sx={{ borderRadius: 4, bgcolor: 'grey.900', p: 3 }}>
          <Typography variant="h4" fontWeight={700} align="center" gutterBottom color="primary">
            Login
          </Typography>
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
            <TextField
              label="Email"
              type="email"
              name="email" // Added name attribute
              fullWidth
              required
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              InputProps={{ sx: { background: 'rgba(30,30,40,0.92)', borderRadius: 2, color: '#fff' } }}
            />
            <TextField
              label="Password"
              type="password"
              name="password" // Added name attribute
              fullWidth
              required
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              InputProps={{ sx: { background: 'rgba(30,30,40,0.92)', borderRadius: 2, color: '#fff' } }}
            />
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, fontWeight: 700, fontSize: '1.1rem', borderRadius: 2 }}>
              Login
            </Button>
          </Box>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;

