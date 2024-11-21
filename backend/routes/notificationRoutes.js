const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('./authMiddleware')

router.get('/', authenticateToken, notificationController.getUpcomingUserEvents);

module.exports = router;