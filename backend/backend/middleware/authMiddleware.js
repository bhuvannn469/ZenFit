const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  console.log('Auth middleware - headers:', req.headers);
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      const token = authHeader.split(' ')[1];
      console.log('Auth middleware - token received:', token ? 'Yes' : 'No');
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Auth middleware - decoded token:', decoded);

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        console.log('Auth middleware - user not found for ID:', decoded.id);
        return res.status(404).json({ msg: 'User not found' });
      }
      
      console.log('Auth middleware - user found:', user._id.toString());
      req.user = user;
      next();
    } catch (error) {
      console.error('Auth middleware - token verification error:', error.message);
      return res.status(401).json({ msg: 'Not authorized, token failed', error: error.message });
    }
  } else {
    console.log('Auth middleware - no token provided');
    return res.status(401).json({ msg: 'Not authorized, no token' });
  }
};

module.exports = protect;
