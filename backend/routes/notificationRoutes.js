const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/:id', notificationController.getFutureUserEvents);

router.get('/:id', notificationController.getUpcomingUserEvents);

module.exports = router;