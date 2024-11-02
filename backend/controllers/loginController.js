const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registration handler
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, confirmPassword, role } = req.body;

  if (!email || !password || !confirmPassword || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = new User({
    email,
    password: hashedPassword,
    role,
  });

  // Save user to the database
  await newUser.save();
  res.status(201).json({ message: 'Registration successful. You can now log in.' });
});


// Login handler
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  // Create a JWT token (replace 'secret' with your JWT secret)
  const token = jwt.sign({ id: user.id, role: user.role }, 'secret', { expiresIn: '1h' });

  res.json({ message: `Logged in as ${user.role}`, token });
});

module.exports = {
  registerUser,
  loginUser,
};
