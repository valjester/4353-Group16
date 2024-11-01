const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose')
// Controller to create a new user
const createUser = asyncHandler(async (req, res) => {
  const { fullName, address1, address2, city, state, zipcode, skills, preferences, availability } = req.body;

  // Basic validation to ensure required fields are provided
  if (!fullName || !address1 || !city || !state || !zipcode || !skills || !availability) {
    return res.status(400).json({ error: 'All required fields must be filled out.' });
  }

  try {
    // Create a new user instance
    const user = new User({
      fullName,
      address1,
      address2,
      city,
      state,
      zipcode,
      skills,
      preferences,
      availability,
      history: []  // Initializes an empty event history
    });

    // Save the new user to the database
    await user.save();

    res.status(201).json({ message: 'User registered successfully', data: user });
  } catch (error) {
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

const getUserProfile = (async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
  
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
  
    res.status(200).json({ data: user });
  });
  const updateUserProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    // Validate the ID format before querying
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID format.' });
    }
  
    const updates = req.body; // Get the updated data from the request body
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true } // Return the updated user and run validators
      );
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      res.json({ message: 'Profile updated successfully', data: updatedUser });
    } catch (error) {
      res.status(500).json({ error: error.message || 'Internal Server Error. Please try again.' });
    }
  });
  

  module.exports = {
    createUser,
    getUserProfile,
    updateUserProfile,
    assignEventToUser
  };
  