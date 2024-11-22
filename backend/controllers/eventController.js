const Event = require('../models/Event');

const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        console.log('Fetched Event from getAllEvents:', events);
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

const editEvent = async (req, res) => {
    console.log('Request body:', req.body);
    const { eventName, eventDescription, location, requiredSkills, urgency, eventDate } = req.body;

    if (!eventName || !eventDescription || !location || !requiredSkills || !urgency || !eventDate) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (!Array.isArray(requiredSkills)) {
        return res.status(400).json({ error: 'requiredSkills must be an array' });
    }

    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            {
                eventName,
                description: eventDescription,
                location,
                $addToSet: { reqSkills: { $each: requiredSkills } },
                urgency,
                eventDate: new Date(eventDate),
            },
            { new: true }
        );
        if (!updatedEvent){ return res.status(404).json({ error: 'Event not found' });}
        res.status(200).json(updatedEvent);
    } catch (error){
        console.error('Error updating event: ', error);
        res.status(500).json({ error: 'Server error in editEvent'});
    }
};


const getSavedEvents = async (req, res) => {
    try {
        const events = await Event.find();
        console.log('Fetched Event from getSavedEvents:', events);
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllEvents,
    createEvent,
    editEvent,
    getSavedEvents,
};
