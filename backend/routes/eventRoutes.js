// backend/routes/eventRoutes.js

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const protectAdminRoute = require('./authMiddleware').protectAdminRoute;

router.get('/', eventController.getAllEvents);

router.post('/', eventController.createEvent);

router.get('/saved', eventController.getSavedEvents);

router.post('/admin', protectAdminRoute, eventController.createEvent);

module.exports = router;
