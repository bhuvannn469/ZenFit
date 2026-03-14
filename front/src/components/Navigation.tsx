import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Drawer, 
  List,
  ListItem, 
  ListItemButton,
  ListItemIcon, 
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import PersonIcon from '@mui/icons-material/Person';
import SpaIcon from '@mui/icons-material/Spa';
import { authService } from '../services/authService';

// Define navigation items
const navItems = [
  { text: 'Home', path: '/', icon: <HomeIcon /> },
  { text: 'Workouts', path: '/workouts', icon: <FitnessCenterIcon /> },
  { text: 'Nutrition', path: '/nutrition', icon: <RestaurantIcon /> },
  { text: 'Wellness', path: '/wellness', icon: <SpaIcon /> },
  { text: 'Profile', path: '/profile', icon: <PersonIcon /> }
];

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const user = authService.getCurrentUser();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  // Drawer content
  const drawer = (
    <Box sx={{ width: 250 }} aria-label="navigation drawer">
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        bgcolor: 'primary.main', 
        color: 'white',
        borderRadius: 0 // Remove rounding from the drawer header background
      }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Phitness Tracker
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {user?.name ?? 'User'}
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 2, // Restore rounded corners for individual tab buttons
                transition: 'background 0.2s',
                '&:hover': {
                  bgcolor: 'primary.light',
                  color: 'primary.main',
                },
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  color: 'primary.main',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  }
                }
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          borderRadius: 0, // Ensure the navigation bar has no rounded edges
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Phitness Tracker
          </Typography>
          {!isMobile && (
            <Box sx={{ display: 'flex' }}>
              {navItems.map((item) => (
                <Button 
                  color="inherit" 
                  key={item.text}
                  onClick={() => handleNavigation(item.path)}
                  sx={{ 
                    mx: 1,
                    textTransform: 'none',
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                    borderBottom: location.pathname === item.path ? '2px solid white' : 'none',
                    borderRadius: 2, // Restore rounded corners for top nav buttons
                    transition: 'background 0.2s',
                    '&:hover': {
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                    }
                  }}
                  startIcon={item.icon}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navigation;
