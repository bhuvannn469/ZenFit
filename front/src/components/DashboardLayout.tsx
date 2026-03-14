import React, { useState } from 'react';
import { Box, Typography, Avatar, List, ListItem, ListItemIcon, InputBase } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SpaIcon from '@mui/icons-material/Spa';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Link, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/home' },
  { label: 'Analytics', icon: <BarChartIcon />, path: '/analytics' },
  { label: 'Nutrition', icon: <RestaurantIcon />, path: '/nutrition' },
  { label: 'Workout', icon: <FitnessCenterIcon />, path: '/workouts' },
  { label: 'Wellness', icon: <SpaIcon />, path: '/wellness' },
  { label: 'Plans', icon: <MenuBookIcon />, path: '/personalized-workout' },
];

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [aiOpen, setAiOpen] = useState(false);
  const [chat, setChat] = useState([
    { sender: 'ai', text: 'Hi! I am your ZenFit AI assistant. How can I help you achieve your fitness goals today?' }
  ]);
  const [input, setInput] = useState('');

  // Get current user data for avatar
  const currentUser = authService.getCurrentUser();
  const userInitial = currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U';

  // Gemini API key (replace with your real key)
  const GEMINI_API_KEY = '***ROTATED_AND_REMOVED***';

  // Send message to Gemini API
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setChat(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userMsg }] }]
          })
        }
      );
      const data = await res.json();
      const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI.';
      setChat(prev => [...prev, { sender: 'ai', text: aiReply }]);
    } catch (err) {
      setChat(prev => [...prev, { sender: 'ai', text: 'Sorry, AI is unavailable.' }]);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar */}
      <Box sx={{ 
        width: 90, 
        bgcolor: 'background.paper', 
        borderRight: '1px solid', 
        borderColor: 'divider',
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        boxShadow: 2,
        zIndex: 1200
      }}>
        {/* ZenFit Logo - Fixed at top */}
        <Box 
          component={Link} 
          to="/home"
          sx={{ 
            mt: 3,
            mb: 4, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer',
            '&:hover': {
              transform: 'scale(1.05)',
              transition: 'transform 0.2s ease-in-out'
            }
          }}
        >
          <Box
            component="img"
            src="/zenfit-logo.png"
            alt="ZenFit Logo"
            sx={{
              width: 48,
              height: 48,
            }}
          />
        </Box>
        
        {/* Navigation Items - Fixed below logo */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {navItems.map(item => (
            <Box
              key={item.label}
              component={Link}
              to={item.path}
              sx={{
                width: 56,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                textDecoration: 'none',
                color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                bgcolor: location.pathname === item.path ? 'action.selected' : 'transparent',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  bgcolor: location.pathname === item.path ? 'action.selected' : 'action.hover',
                  transform: 'scale(1.05)'
                }
              }}
            >
              {item.icon}
            </Box>
          ))}
        </Box>
        
        {/* Spacer to push profile to bottom */}
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Profile Avatar - Fixed at bottom */}
        <Avatar 
          component={Link} 
          to="/profile" 
          sx={{ 
            bgcolor: 'primary.main', 
            width: 48, 
            height: 48, 
            cursor: 'pointer',
            mb: 3,
            '&:hover': { 
              boxShadow: 4, 
              transform: 'scale(1.05)',
              transition: 'all 0.2s ease-in-out'
            }
          }}
        >
          {userInitial}
        </Avatar>
      </Box>
      {/* Main Content */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative',
        marginLeft: '90px' /* Account for fixed sidebar width */
      }}>
        {/* Top Bar */}
        {/* (Top bar removed as per previous requests) */}
        {/* Page Content */}
        <Box sx={{ flex: 1, p: 4, overflow: 'auto' }}>{children}</Box>

        {/* Floating AI Button */}
        <Box sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1300 }}>
          <Box
            onClick={() => setAiOpen(true)}
            sx={{
              width: 64,
              height: 64,
              bgcolor: 'primary.main',
              borderRadius: '50%',
              boxShadow: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s',
              '&:hover': { boxShadow: 8, bgcolor: 'primary.dark' },
            }}
            title="ZenFit AI Assistant"
          >
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="18" fill="#fff"/><text x="50%" y="55%" textAnchor="middle" fill="#1976d2" fontSize="18" fontWeight="bold" dy=".3em">AI</text></svg>
          </Box>
        </Box>

        {/* AI Chat Modal */}
        {aiOpen && (
          <Box sx={{
            position: 'fixed',
            bottom: 120,
            right: 32,
            width: 340,
            maxHeight: 480,
            bgcolor: '#fff',
            borderRadius: 3,
            boxShadow: 8,
            zIndex: 1400,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
            <Box sx={{ bgcolor: 'primary.main', color: '#fff', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography fontWeight={700}>ZenFit AI Chat</Typography>
              <Box sx={{ cursor: 'pointer', fontSize: 22, ml: 2 }} onClick={() => setAiOpen(false)}>&times;</Box>
            </Box>
            <Box sx={{ flex: 1, p: 2, overflowY: 'auto', bgcolor: '#f7f8fa' }}>
              {chat.map((msg, idx) => (
                <Box key={msg.sender + msg.text + idx} sx={{ mb: 1, display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  <Box sx={{
                    bgcolor: msg.sender === 'user' ? 'primary.light' : '#fff',
                    color: '#000',
                    px: 2, py: 1, borderRadius: 2, maxWidth: '80%',
                    boxShadow: msg.sender === 'user' ? 1 : 0,
                  }}>{msg.text}</Box>
                </Box>
              ))}
            </Box>
            <Box sx={{ p: 2, borderTop: '1px solid #eee', display: 'flex', gap: 1 }}>
              <InputBase
                placeholder="Type your message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                sx={{ flex: 1, bgcolor: '#f7f8fa', borderRadius: 2, px: 2, fontSize: 15 }}
                autoFocus
              />
              <Box
                onClick={handleSend}
                sx={{ bgcolor: 'primary.main', color: '#fff', px: 2, py: 1, borderRadius: 2, cursor: 'pointer', fontWeight: 700, fontSize: 15 }}
              >Send</Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
