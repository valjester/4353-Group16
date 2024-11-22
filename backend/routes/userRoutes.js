const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { registerUser, loginUser } = require('../controllers/loginController');
const { authenticateToken } = require('./authMiddleware');

// get a user's profile by ID
router.get('/:id', authenticateToken, userController.getUserProfile);

// update a user's profile by ID
router.put('/profile', authenticateToken, userController.updateUserProfile);

// create a new user
router.post('/register', registerUser);

// create a new user
router.post('/login', loginUser);

module.exports = router;