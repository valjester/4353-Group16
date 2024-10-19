// controllers/eventController.js

// In-memory storage for events
let savedEvents = [
    {
        id: 1,
        eventName: 'Community Cleanup',
        eventDescription: 'Join us for a day of cleaning up the local park!',
        location: 'Central Park',
        requiredSkills: ['teamwork', 'communication'],
        urgency: 'high',
        eventDate: '2024-10-25', 
    }
];

const getAllEvents = (req, res) => {
    res.json(savedEvents);
};

const addEvent = (req, res) => {
    const { eventName, eventDescription, location, requiredSkills, urgency, eventDate } = req.body;

    if (!eventName || !eventDescription || !location || !requiredSkills || !urgency || !eventDate) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const newEvent = {
        id: savedEvents.length + 1, // Generate ID
        eventName,
        eventDescription,
        location,
        requiredSkills,
        urgency,
        eventDate,
    };

    savedEvents.push(newEvent);
    
    res.status(201).json(newEvent);
};

const getSavedEvents = (req, res) => {
    res.json(savedEvents); 
};

module.exports = {
    getAllEvents,
    addEvent,
    getSavedEvents,
};
