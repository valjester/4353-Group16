// backend/controllers/eventController.js

const Event = require('../models/Event');



const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Server error'});
    }
};

const createEvent = async (req, res) => {
    console.log(req.body);
    const { eventName, description, location, reqSkills, urgency, eventDate } = req.body;

    if (!eventName || !description || !location || !reqSkills || !urgency || !eventDate) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const newEvent = new Event({
            eventName,
            description,
            location,
            reqSkills,
            urgency,
            eventDate: new Date(eventDate),
        });

        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        console.error('Error creating event: ', error);
        res.status(500).json({ error: 'Server error' });
    }
};

/*const editEvent = (req, res) => {
    const { eventID, eventName, eventDescription, location, requiredSkills, urgency, eventDate } = req.body;

    if (!eventID || !eventName || !eventDescription || !location || !requiredSkills || !urgency || !eventDate) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const modifiedEvent = {
        eventID,
        eventName,
        eventDescription,
        location,
        requiredSkills,
        urgency,
        eventDate,
    };

    savedEvents[eventID] = modifiedEvent;

    res.status(201).json(modfiedEvent);
};*/


const getSavedEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllEvents,
    createEvent,
    /*editEvent,*/
    getSavedEvents,
};
