const asyncHandler = require('express-async-handler');
//const { getUserProfile } = require('./userController');
const { getAllEvents } = require('./eventController');
const User = require('../models/User');

const getAllUserEvents = asyncHandler(async (req, res) => {
    console.log("Get Upcoming User Events called");

    const userID = req.user.id;
    
    const user = await User.findById(userID).populate('history');
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    console.log("User found! Yippee!");
    console.log("User: ", user);
    console.log("\nUser History");
    for (let i = 0; i < user.history.length; i++) {
        console.log("Event: ", user.history[i]);
    }

    if(!user.history || user.history.length === 0) {
        console.log("No events found");
        return res.status(404).json ({ error: 'No events found for this user.' });
    }
    const currentDate = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(currentDate.getDate() + 7);

    const allEvents = user.history;
    console.log("EVENTS:");
    console.log(allEvents);
    res.status(200).json({ events: allEvents });
})

const getUpcomingUserEvents = asyncHandler(async (req, res) => {
    console.log("Get Upcoming User Events called");

    const userID = req.user.id;
    
    const user = await User.findById(userID).populate('history');
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    console.log("User found! Yippee!");
    console.log("User: ", user);
    console.log("\nUser History");
    for (let i = 0; i < user.history.length; i++) {
        console.log("Event: ", user.history[i]);
    }

    if(!user.history || user.history.length === 0) {
        console.log("No events found");
        return res.status(404).json ({ error: 'No events found for this user.' });
    }
    const currentDate = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(currentDate.getDate() + 7);

    const allEvents = user.history;
    console.log("EVENTS:");
    console.log(allEvents[0]);
    console.log("Trying name:", allEvents[0].eventName);

    const upcomingEvents = user.history.filter(event => {
        const eventDate = new Date(event.eventDate);
        console.log(eventDate,'\n', currentDate, '\n', sevenDaysLater);
        return eventDate >= currentDate && eventDate <= sevenDaysLater;
    });
    
    if (upcomingEvents.length === 0) {
        return res.status(404).json({ error: 'No upcoming events found for this user.'});
    }
    
    console.log("FILTERED:");
    console.log(upcomingEvents);
    res.status(200).json({ events: upcomingEvents });
})

module.exports = {
    getAllUserEvents,
    getUpcomingUserEvents,
};