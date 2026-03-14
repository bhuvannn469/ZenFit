import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,

  Card
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { authService, RegisterData } from '../services/authService';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const registerData: RegisterData = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };
      await authService.register(registerData);
      setSuccessMessage('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error: any) {
      if (error.response) {
        setError(error.response.data?.msg ?? 'Registration failed. Please try again.');
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Failed to register. Please check your connection and try again.');
      }
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
            Register
          </Typography>
          <Box component="form" onSubmit={handleRegister} sx={{ mt: 2 }}>
            <TextField
              label="Name"
              fullWidth
              required
              margin="normal"
              value={formData.name}
              onChange={handleChange}
              InputProps={{ sx: { background: 'rgba(30,30,40,0.92)', borderRadius: 2, color: '#fff' } }}
            />
            <TextField
              label="Email"
              type="email"
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
              fullWidth
              required
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              InputProps={{ sx: { background: 'rgba(30,30,40,0.92)', borderRadius: 2, color: '#fff' } }}
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              required
              margin="normal"
              value={formData.confirmPassword}
              onChange={handleChange}
              InputProps={{ sx: { background: 'rgba(30,30,40,0.92)', borderRadius: 2, color: '#fff' } }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, fontWeight: 700, fontSize: '1.1rem', borderRadius: 2 }}>
              Register
            </Button>
          </Box>
        </Card>
      </Box>
    </Container>
  );
};

export default Register;
