const User = require('../models/User');

// Send friend request
const sendFriendRequest = async (req, res) => {
  try {
    const { friendId } = req.body;
    const user = await User.findById(req.user._id);
    const friend = await User.findById(friendId);

    if (!friend) return res.status(404).json({ msg: 'User not found' });
    if (user.friendRequests.includes(friendId) || user.friends.includes(friendId)) {
      return res.status(400).json({ msg: 'Already friends or request pending' });
    }

    // Add this user to friend's friendRequests
    friend.friendRequests.push(user._id);
    await friend.save();

    res.json({ msg: 'Friend request sent' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Accept friend request
const acceptFriendRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;
    const user = await User.findById(req.user._id);
    const requester = await User.findById(requesterId);

    if (!requester) return res.status(404).json({ msg: 'User not found' });

    // Check if the request exists
    if (!user.friendRequests.includes(requesterId)) {
      return res.status(400).json({ msg: 'No friend request from this user' });
    }

    // Remove from friendRequests and add to friends
    user.friendRequests = user.friendRequests.filter(id => id.toString() !== requesterId);
    user.friends.push(requesterId);

    requester.friends.push(user._id);

    await user.save();
    await requester.save();

    res.json({ msg: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Reject friend request
const rejectFriendRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.friendRequests.includes(requesterId)) {
      return res.status(400).json({ msg: 'No friend request from this user' });
    }

    user.friendRequests = user.friendRequests.filter(id => id.toString() !== requesterId);
    await user.save();

    res.json({ msg: 'Friend request rejected' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Get friends and friend requests list
const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friends', 'name email')
      .populate('friendRequests', 'name email');
    res.json({
      friends: user.friends,
      friendRequests: user.friendRequests
    });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends
};
