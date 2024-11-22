// backend/routes/eventRoutes.js

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const protectAdminRoute = require('./authMiddleware').protectAdminRoute;
const { getMatchingVolunteers, assignVolunteersToEvent } = require('../controllers/matchController');


router.get('/', eventController.getAllEvents);

router.post('/admin', protectAdminRoute, eventController.createEvent);

router.put('/:id', protectAdminRoute, eventController.editEvent);

router.get('/saved', eventController.getSavedEvents);

router.get('/matching-volunteers', getMatchingVolunteers);
router.post('/assign-volunteers', assignVolunteersToEvent);

router.post('/', eventController.createEvent);

router.post('/', eventController.editEvent);

module.exports = router;
