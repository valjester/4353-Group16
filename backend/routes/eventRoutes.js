// backend/routes/eventRoutes.js

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const protectAdminRoute = require('./authMiddleware').protectAdminRoute;
const { getMatchingVolunteers, assignVolunteersToEvent } = require('../controllers/matchController');


router.get('/', eventController.getAllEvents);

router.post('/', eventController.createEvent);

router.post('/', eventController.editEvent);

router.get('/saved', eventController.getSavedEvents);

router.post('/admin', protectAdminRoute, eventController.createEvent);

router.get('/matching-volunteers', getMatchingVolunteers);
router.post('/assign-volunteers', assignVolunteersToEvent);

module.exports = router;
