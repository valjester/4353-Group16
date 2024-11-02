// Import functions from the model
const { getAllEvents, addEvent } = require('./eventmodel');

// Fetch all events
const getAllEventsController = async (req, res) => {
    try {
        const events = await getAllEvents();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
};

// Add a new event
const addEventController = async (req, res) => {
    const { eventName, eventDescription, location, requiredSkills, urgency, eventDate } = req.body;

    if (!eventName || !eventDescription || !location || !requiredSkills || !urgency || !eventDate) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const newEvent = await addEvent({
            eventName,
            eventDescription,
            location,
            requiredSkills,
            urgency,
            eventDate,
        });
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add event' });
    }
};

// Export the controllers
module.exports = {
    getAllEvents: getAllEventsController,
    addEvent: addEventController,
};
