const express = require('express');
const router = express.Router();
const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends
} = require('../controllers/friendController');
const protect = require('../middleware/authMiddleware');

// Friend system routes
router.post('/request', protect, sendFriendRequest);            // Send request
router.post('/accept', protect, acceptFriendRequest);           // Accept request
router.post('/reject', protect, rejectFriendRequest);           // Reject request
router.get('/', protect, getFriends);                           // Get friends & requests

module.exports = router;
