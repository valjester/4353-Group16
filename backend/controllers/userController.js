const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose')

const createUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      skills: [],
      preferences: "None",
      availability: [],
      history: []
    });

    await user.save();


    res.status(201).json({
      message: 'User registered successfully',
      data: {
        _id: newUser._id,
      },
    });
  } catch (error) {
    if (error.code === 11000) { 
      return res.status(400).json({ error: 'Email already exists.' });
    }
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});



const assignEventToUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { eventId } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  user.history.push(eventId);
  await user.save();

  res.json({ message: 'Event assigned successfully', data: user });
});

const getUserProfile = async (req, res) => {
  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID format.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

const updateUserProfile = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid user ID format.' });
  }

  const updates = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
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

const getUserHistory = async (req, res) => {
  const { userId } = req.params;

  try {
      const user = await User.findById(userId).populate('history'); // Populate event details
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ history: user.history });
  } catch (error) {
      console.error('Error fetching user history:', error);
      res.status(500).json({ error: 'Server error' });
  }
};

  module.exports = {
    createUser,
    getUserProfile,
    updateUserProfile,
    assignEventToUser
  };
  