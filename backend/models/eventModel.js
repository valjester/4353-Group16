const events = []; // Array to hold events

const getAllEvents = () => events;

const addEvent = (event) => {
    events.push(event);
    return event;
};

module.exports = {
    getAllEvents,
    addEvent,
};