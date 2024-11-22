const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose')

const getUserProfile = async (req, res) => {
  console.log('getUserProfile called.')
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID format.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    console.log(user)
    res.status(200).json({ data: user.toObject() });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

const updateUserProfile = async (req, res) => {
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID format.' });
  }

  const updates = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ message: 'Profile updated successfully', data: updatedUser });
  } catch (error) {
    console.error('Update user profile error:', error); // Log the error for debugging
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

  module.exports = {
    getUserProfile,
    updateUserProfile,
    //assignEventToUser
  };
  