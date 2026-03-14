import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';

// This will be a shared layout component that can include navigation and other shared UI elements
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box>      
      <Box 
        component="main" 
        sx={{ 
          padding: isMobile ? 2 : 4,
        }}
      >
        {children}
      </Box>
    </Box>  
  );
};

export default Layout;
