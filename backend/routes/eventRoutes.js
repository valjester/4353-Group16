// routes/eventRoutes.js

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/', eventController.getAllEvents);

router.post('/', eventController.addEvent);

router.get('/saved', eventController.getSavedEvents);

module.exports = router;
