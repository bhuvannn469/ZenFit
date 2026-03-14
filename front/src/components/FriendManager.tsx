import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Typography,
  Box,
  Tabs,
  Tab,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  People as PeopleIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import socialService, { Friend, FriendRequest } from '../services/socialService';

interface FriendManagerProps {
  open: boolean;
  onClose: () => void;
  onFriendsUpdate: () => void;
}

const FriendManager: React.FC<FriendManagerProps> = ({ open, onClose, onFriendsUpdate }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchFriends();
    }
  }, [open]);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const data = await socialService.getFriends();
      setFriends(data.friends);
      setFriendRequests(data.friendRequests);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      const results = await socialService.searchUsers(searchQuery);
      // Filter out current friends and pending requests
      const filteredResults = results.filter(user => 
        !friends.some(friend => friend._id === user._id) &&
        !friendRequests.some(request => request._id === user._id)
      );
      setSearchResults(filteredResults);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendFriendRequest = async (friendId: string) => {
    try {
      await socialService.sendFriendRequest(friendId);
      setSuccess('Friend request sent successfully!');
      // Remove from search results
      setSearchResults(prev => prev.filter(user => user._id !== friendId));
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleAcceptRequest = async (requesterId: string) => {
    try {
      await socialService.acceptFriendRequest(requesterId);
      setSuccess('Friend request accepted!');
      fetchFriends();
      onFriendsUpdate();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleRejectRequest = async (requesterId: string) => {
    try {
      await socialService.rejectFriendRequest(requesterId);
      fetchFriends();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const TabPanel = ({ children, value, index }: any) => (
    <Box role="tabpanel" hidden={value !== index}>
      {value === index && children}
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PeopleIcon />
          <Typography variant="h6">Manage Friends</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)} sx={{ mb: 2 }}>
          <Tab 
            icon={<SearchIcon />} 
            label="Find Friends" 
            iconPosition="start"
          />
          <Tab 
            icon={<PeopleIcon />} 
            label={`My Friends (${friends.length})`}
            iconPosition="start"
          />
          <Tab 
            icon={<NotificationsIcon />} 
            label={`Requests (${friendRequests.length})`}
            iconPosition="start"
          />
        </Tabs>

        {/* Find Friends Tab */}
        <TabPanel value={currentTab} index={0}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button 
                      variant="contained" 
                      onClick={handleSearch}
                      disabled={loading || !searchQuery.trim()}
                      sx={{ borderRadius: 2 }}
                    >
                      Search
                    </Button>
                  </InputAdornment>
                )
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {searchResults.length === 0 && searchQuery && !loading && (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No users found. Try a different search term.
                </Typography>
              )}
              {searchResults.map((user) => (
                <ListItem key={user._id} sx={{ borderRadius: 2, mb: 1, bgcolor: 'grey.50' }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.name}
                    secondary={user.email}
                  />
                  <ListItemSecondaryAction>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<PersonAddIcon />}
                      onClick={() => handleSendFriendRequest(user._id)}
                      sx={{ borderRadius: 2 }}
                    >
                      Add Friend
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </TabPanel>

        {/* My Friends Tab */}
        <TabPanel value={currentTab} index={1}>
          <List>
            {friends.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No friends yet. Search for users to connect with!
              </Typography>
            ) : (
              friends.map((friend) => (
                <ListItem key={friend._id} sx={{ borderRadius: 2, mb: 1, bgcolor: 'grey.50' }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      {friend.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={friend.name}
                    secondary={friend.email}
                  />
                  <ListItemSecondaryAction>
                    <Chip 
                      label="Friends" 
                      size="small" 
                      color="success"
                      icon={<CheckIcon />}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            )}
          </List>
        </TabPanel>

        {/* Friend Requests Tab */}
        <TabPanel value={currentTab} index={2}>
          <List>
            {friendRequests.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No pending friend requests.
              </Typography>
            ) : (
              friendRequests.map((request) => (
                <ListItem key={request._id} sx={{ borderRadius: 2, mb: 1, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      {request.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={request.name}
                    secondary={request.email}
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        color="success"
                        onClick={() => handleAcceptRequest(request._id)}
                        sx={{ bgcolor: 'success.main', color: 'white', '&:hover': { bgcolor: 'success.dark' } }}
                      >
                        <CheckIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleRejectRequest(request._id)}
                        sx={{ bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            )}
          </List>
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FriendManager;
