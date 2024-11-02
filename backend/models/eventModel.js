// Import mongoose
const mongoose = require('mongoose');

// Define Event Schema
const eventSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    eventDescription: { type: String, required: true },
    location: { type: String, required: true },
    requiredSkills: { type: [String], required: true },
    urgency: { type: String, required: true },
    eventDate: { type: Date, required: true },
});

// Create Event model from the schema
const Event = mongoose.model('Event', eventSchema);

// Fetch all events from MongoDB
const getAllEvents = async () => {
    return await Event.find();
};

// Add a new event to MongoDB
const addEvent = async (eventData) => {
    const event = new Event(eventData);
    return await event.save();
};

module.exports = {
    getAllEvents,
    addEvent,
};
