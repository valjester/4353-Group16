const asyncHandler = require('express-async-handler');
//const { getUserProfile } = require('./userController');
const { getEventbyID } = require('./eventController');
const users = require('./userController');
var events = require('./eventController');

const getFutureUserEvents = asyncHandler(async (req, res) => {
    //const userID = req.params.id;
    //const user = users[userID];
    const user = users[123];    //use the hardcoded user 123

    if(!user) {
        return res.status(404).json({ error: 'User not found.' });
    }

    if(!user.events || user.events.length === 0) {
        return res.status(404).json ({ error: 'No events found for this user.' });
    }

    const currentDate = new Date();

    const futureEvents = user.events
        .map(eventID => getEventByID(eventID))
        .filter(event => new Date(event.date >= currentDate));
    
    if (futureEvents.length === 0) {
        return res.status(404).json({ error: 'No future events found for this user.'});
    }

    res.status(200).json({ events: futureEvents });
})

const getUpcomingUserEvents = asyncHandler(async (req, res) => {
    //const userID = req.params.id;
    //const user = users[userID];
    const user = users[123];    //use the hardcoded user 123

    if(!user) {
        return res.status(404).json({ error: 'User not found.' });
    }

    if(!user.events || user.events.length === 0) {
        return res.status(404).json ({ error: 'No events found for this user.' });
    }

    const currentDate = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(currentDate.getDate() + 7);

    const upcomingEvents = user.events
        .map(eventID => getEventByID(eventID))
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