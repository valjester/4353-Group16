const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { registerUser, loginUser } = require('../controllers/loginController');
// get a user's profile by ID
router.get('/:id', userController.getUserProfile);

// update a user's profile by ID
router.put('/:id/profile', userController.updateUserProfile);

// create a new user
router.post('/register', registerUser);

// create a new user
router.post('/login', loginUser);

// assign an event to a user by ID
router.post('/:id', userController.assignEventToUser);

module.exports = router;
