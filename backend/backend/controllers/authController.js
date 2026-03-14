const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.register = async (req, res) => {
  try {
    const { name, email, password, age, weight, height, gender } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name, email, password: hashedPassword, age, weight, height, gender
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    console.log('Update profile request body:', req.body);
    console.log('User ID from token:', req.user.id);
    
    const { name, email, age, weight, height, gender } = req.body;

    // Build profile object
    const profileFields = {};
    if (name) profileFields.name = name;
    if (email) profileFields.email = email;
    if (age !== undefined) profileFields.age = age;
    if (weight !== undefined) profileFields.weight = weight;
    if (height !== undefined) profileFields.height = height;
    if (gender) profileFields.gender = gender;

    console.log('Profile fields to update:', profileFields);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');

    if (!user) {
      console.log('User not found for ID:', req.user.id);
      return res.status(404).json({ msg: "User not found" });
    }

    console.log('Updated user:', user);
    res.json(user);
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Request password reset
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User with that email doesn't exist" });

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // In a production app, you would:
    // 1. Hash this token
    // 2. Store the hashed token in the database with an expiration
    // 3. Send an email with a link containing the unhashed token
    
    // For this demo, we'll just simulate success
    res.json({ msg: "Password reset email sent", token: resetToken });
  } catch (error) {
    console.error("Request Password Reset Error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Reset password with token
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // In a production app, you would:
    // 1. Find the user with the matching hashed token
    // 2. Check token expiration
    // 3. Update the password
    
    // For this demo, we'll simulate token validation with a static value
    if (token === 'invalid') {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    // In a real implementation, you'd find the user with the token
    // const user = await User.findOne({ resetPasswordToken: hashedToken });
    
    // For demo, we'll use an email instead
    const user = await User.findOne({ email: 'demo@example.com' });
    if (!user) return res.status(404).json({ msg: "User not found" });
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    
    await user.save();
    
    res.json({ msg: "Password updated successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
