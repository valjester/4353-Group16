const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventId: {type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId()},
    eventName: {type: String, required: true, maxlength: 100},
    description: {type: String, required: true},
    location: {type: String, required: true},
    reqSkills: {type: [String], required: true, default: []},
    urgency: {type: String, required: true, enum: ['low', 'medium', 'high']},
    eventDate: { type: Date, default: [] }
});

module.exports = mongoose.model('Event', eventSchema);