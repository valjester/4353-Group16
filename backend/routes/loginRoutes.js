const express = require('express');
const { registerUser, loginUser } = require('../controllers/loginController');
const router = express.Router();

// Route to register a user
router.post('/register', registerUser);

// Route to login a user
router.post('/login', loginUser);

module.exports = router;
