const asyncHandler = require('express-async-handler');
//const { getUserProfile } = require('./userController');
//const { getEventbyID } = require('./eventController');
const users = require('./userController');
var events = require('./eventController');

const getAllUserEvents = asyncHandler(async (req, res) => {
    //const userID = req.params.id;
    //const user = users[userID];
    const user = users[123];    //use the hardcoded user 123

    if(!user) {
        return res.status(404).json({ error: 'User not found.' });
    }

    if(!user.events || user.events.length === 0) {
        return res.status(404).json ({ error: 'No events found for this user.' });
    }

    const userEventDetails = user.events.map(eventID => {
        return events[eventID];
    });

    res.status(200).json({ events: userEventDetails });
});


module.exports = { getAllUserEvents };