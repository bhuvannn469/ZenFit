import React from 'react';
import { Typography, Stack, Box } from '@mui/material';
import DashboardLayout from '../components/DashboardLayout';

const mockWorkouts = [
  { id: 'w1', name: 'Morning Cardio', status: 'completed', date: '2025-07-18' },
  { id: 'w2', name: 'Strength Training', status: 'pending', date: '2025-07-19' },
];

const WorkoutCalendar: React.FC = () => {
  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 700, mx: 'auto', width: '100%' }}>
        <Typography variant="h3" fontWeight={900} color="primary" mb={2}>
          Workout Calendar
        </Typography>
        <Stack spacing={2}>
          {mockWorkouts.map(w => (
            <Box key={w.id} sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
              <Typography variant="body1">{w.name} - {w.status} ({w.date})</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </DashboardLayout>
  );
};

export default WorkoutCalendar;
