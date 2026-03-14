
import React, { useState } from 'react';
import { Box, Typography, Divider, Paper, Stack } from '@mui/material';
import DashboardLayout from '../components/DashboardLayout';

const mockWorkouts = [
  { id: 'w1', name: 'Morning Cardio', status: 'completed', date: '2025-07-18' },
  { id: 'w2', name: 'Strength Training', status: 'pending', date: '2025-07-19' },
];
const mockSleep = [
  { id: 's1', date: '2025-07-18', hours: 7, quality: 'Good' },
  { id: 's2', date: '2025-07-19', hours: 6, quality: 'Average' },
];
const mockMeditation = [
  { id: 'm1', date: '2025-07-18', duration: 15, type: 'Mindfulness' },
  { id: 'm2', date: '2025-07-19', duration: 10, type: 'Guided' },
];

const Analytics: React.FC = () => {
  const [workouts] = useState(mockWorkouts);
  const [sleep] = useState(mockSleep);
  const [meditation] = useState(mockMeditation);

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 900, mx: 'auto', width: '100%' }}>
        <Typography variant="h3" fontWeight={900} color="primary" mb={2}>
          Progress & Analytics
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} mb={3}>
          <Box flex={1}>
            <Typography variant="h5" fontWeight={700} gutterBottom>Workouts</Typography>
            {workouts.map(w => (
              <Paper key={w.id} variant="outlined" sx={{ p: 2, mb: 1, bgcolor: 'grey.100', color: 'text.primary' }}>
                <Typography>{w.name} - {w.status} ({w.date})</Typography>
              </Paper>
            ))}
          </Box>
          <Box flex={1}>
            <Typography variant="h5" fontWeight={700} gutterBottom>Sleep</Typography>
            {sleep.map(s => (
              <Paper key={s.id} variant="outlined" sx={{ p: 2, mb: 1, bgcolor: 'grey.100', color: 'text.primary' }}>
                <Typography>Date: {s.date}</Typography>
                <Typography>Hours: {s.hours}</Typography>
                <Typography>Quality: {s.quality}</Typography>
              </Paper>
            ))}
          </Box>
          <Box flex={1}>
            <Typography variant="h5" fontWeight={700} gutterBottom>Meditation</Typography>
            {meditation.map(m => (
              <Paper key={m.id} variant="outlined" sx={{ p: 2, mb: 1, bgcolor: 'grey.100', color: 'text.primary' }}>
                <Typography>Date: {m.date}</Typography>
                <Typography>Duration: {m.duration} min</Typography>
                <Typography>Type: {m.type}</Typography>
              </Paper>
            ))}
          </Box>
        </Stack>
      </Box>
    </DashboardLayout>
  );
};

export default Analytics;
