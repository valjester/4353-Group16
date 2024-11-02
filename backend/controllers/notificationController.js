const asyncHandler = require('express-async-handler');
//const { getUserProfile } = require('./userController');
const { getAllEvents } = require('./eventController');
const User = require('../models/User');

const getFutureUserEvents = asyncHandler(async (req, res) => {
    const userID = req.params.id;
    const user = await User.findById(userID);

    if(!user) {
        return res.status(404).json({ error: 'User not found.' });
    }

    if(!user.history || user.history.length === 0) {
        return res.status(404).json ({ error: 'No events found for this user.' });
    }

    const currentDate = new Date();
    const allEvents = await getAllEvents();

    const futureEvents = allEvents
        .filter(event => user.history.includes(event.id))
        .filter(event => new Date(event.date >= currentDate));
    
    if (futureEvents.length === 0) {
        return res.status(404).json({ error: 'No future events found for this user.'});
    }

    res.status(200).json({ events: futureEvents });
})

const getUpcomingUserEvents = asyncHandler(async (req, res) => {
    const userID = req.params.id;
    const user = await User.findById(userID);

    if(!user) {
        return res.status(404).json({ error: 'User not found.' });
    }

    if(!user.history || user.history.length === 0) {
        return res.status(404).json ({ error: 'No events found for this user.' });
    }

    const currentDate = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(currentDate.getDate() + 7);

    const allEvents = await getAllEvents();
    
    const upcomingEvents = allEvents
        .filter(event => user.history.includes(event.id))
        .filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= currentDate && eventDate <= sevenDaysLater;
        });
    
    if (futureEvents.length === 0) {
        return res.status(404).json({ error: 'No upcoming events found for this user.'});
    }

    res.status(200).json({ events: upcomingEvents });
})

module.exports = {
    getFutureUserEvents,
    getUpcomingUserEvents,
};