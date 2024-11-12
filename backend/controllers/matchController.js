const { useRef } = require('react');
const User = require('../models/User');
const Event = require('../models/Event');

const getMatchingVolunteers = async (req, res) => {
    console.log('Received eventId in backend:', req.query.eventId);
  const eventId = req.query.eventId;
  console.log('Event ID from query:', eventId);
  if (!eventId) {
      return res.status(400).json({ error: 'Event ID is required' });
    }

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const matchingVolunteers = await User.find({
      skills: { $in: event.reqSkills },
      availability: { $gte: event.eventDate },
      role: "volunteer",
    }).lean();
    console.log('Matching Volunteers:', matchingVolunteers);

    const locationFilteredVolunteers = matchingVolunteers.filter(volunteer => {
        const cityState = `${volunteer.city}, ${volunteer.state}`;
        return event.location.toLowerCase().includes(cityState.toLowerCase());
      });
      console.log('Location-filtered Volunteers:', locationFilteredVolunteers);
  
      res.status(200).json(locationFilteredVolunteers);
    } catch (error) {
      console.error('Error fetching matching volunteers:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };


  const assignVolunteersToEvent = async (req, res) => {
    const { eventId, volunteerIds } = req.body;
    console.log('Request body:', req.body);
  
    try {
      console.log('Finding event with eventId:', eventId);
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      console.log('Current volunteers assigned:', event.volunteersAssigned);
  
      // Filter out volunteer IDs that are already assigned to the event
      const volunteersToAssign = volunteerIds.filter(volunteerId => {
        return !event.volunteersAssigned.includes(volunteerId);
      });
  
      if (volunteersToAssign.length === 0) {
        return res.status(400).json({ message: 'All selected volunteers are already assigned to this event' });
      }
  
      // Update the event with the new volunteers
      event.volunteersAssigned = [...new Set([...event.volunteersAssigned, ...volunteersToAssign])];
      await Event.updateOne({ _id: eventId }, { $set: { volunteersAssigned: event.volunteersAssigned } });
      console.log('Updated event saved successfully');
  
      console.log('Updating users with IDs:', volunteersToAssign);
  
      // Update users (volunteers)
      for (let volunteerId of volunteersToAssign) {
        const volunteer = await User.findById(volunteerId);
  
        if (!volunteer) {
          return res.status(404).json({ message: `Volunteer with ID ${volunteerId} not found` });
        }
  
        if (volunteer.history.includes(eventId)) {
          // This should be unreachable if filtering was done correctly above
          return res.status(400).json({ message: `${volunteer.fullName} is already assigned to this event` });
        }
  
        await User.updateOne(
          { _id: volunteerId },
          {
            $push: { history: eventId },
            $pull: { availability: { $eq: new Date(event.eventDate) } },
          }
        );
      }
  
      console.log('Users updated successfully');
      res.status(200).json({ message: 'Volunteers successfully assigned to the event.' });
    } catch (error) {
      console.error('Error assigning volunteers:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  
  module.exports = { getMatchingVolunteers, assignVolunteersToEvent };
