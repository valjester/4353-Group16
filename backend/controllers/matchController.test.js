const { getMatchingVolunteers, assignVolunteersToEvent } = require('./matchController');
const User = require('../models/User');
const Event = require('../models/Event');

jest.mock('../models/User');
jest.mock('../models/Event');

describe('Match Controller', () => {
  describe('getMatchingVolunteers', () => {
    it('should return 400 if no eventId is provided', async () => {
      const req = { query: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getMatchingVolunteers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Event ID is required' });
    });

    it('should return 404 if event is not found', async () => {
      const req = { query: { eventId: '123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Event.findById.mockResolvedValue(null);

      await getMatchingVolunteers(req, res);

      expect(Event.findById).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Event not found' });
    });

    it('should return volunteers matching skills, availability, and location', async () => {
      const req = { query: { eventId: '123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockEvent = {
        reqSkills: ['Skill1'],
        eventDate: new Date('2024-12-01'),
        location: 'Austin, TX',
      };
      const mockVolunteers = [
        { city: 'Austin', state: 'TX', skills: ['Skill1'], availability: new Date('2024-12-02') },
        { city: 'Houston', state: 'TX', skills: ['Skill1'], availability: new Date('2024-12-01') },
      ];
      const filteredVolunteers = [mockVolunteers[0]];

      Event.findById.mockResolvedValue(mockEvent);
      User.find.mockResolvedValue(mockVolunteers);

      await getMatchingVolunteers(req, res);

      expect(Event.findById).toHaveBeenCalledWith('123');
      expect(User.find).toHaveBeenCalledWith({
        skills: { $in: mockEvent.reqSkills },
        availability: { $gte: mockEvent.eventDate },
        role: 'volunteer',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(filteredVolunteers);
    });

    it('should handle server errors', async () => {
      const req = { query: { eventId: '123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Event.findById.mockRejectedValue(new Error('Database error'));

      await getMatchingVolunteers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  describe('assignVolunteersToEvent', () => {
    it('should return 404 if event is not found', async () => {
      const req = { body: { eventId: '123', volunteerIds: ['v1'] } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Event.findById.mockResolvedValue(null);

      await assignVolunteersToEvent(req, res);

      expect(Event.findById).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Event not found' });
    });

    it('should return 400 if all volunteers are already assigned', async () => {
      const req = { body: { eventId: '123', volunteerIds: ['v1'] } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockEvent = {
        volunteersAssigned: ['v1'],
      };

      Event.findById.mockResolvedValue(mockEvent);

      await assignVolunteersToEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'All selected volunteers are already assigned to this event',
      });
    });

    it('should update volunteers and the event correctly', async () => {
      const req = { body: { eventId: '123', volunteerIds: ['v1', 'v2'] } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockEvent = {
        _id: '123',
        volunteersAssigned: ['v1'],
        eventDate: new Date('2024-12-01'),
      };

      const mockVolunteer = {
        _id: 'v2',
        history: [],
      };

      Event.findById.mockResolvedValue(mockEvent);
      User.findById.mockResolvedValue(mockVolunteer);
      Event.updateOne.mockResolvedValue();
      User.updateOne.mockResolvedValue();

      await assignVolunteersToEvent(req, res);

      expect(Event.updateOne).toHaveBeenCalledWith(
        { _id: '123' },
        { $set: { volunteersAssigned: ['v1', 'v2'] } }
      );
      expect(User.updateOne).toHaveBeenCalledWith(
        { _id: 'v2' },
        {
          $push: { history: '123' },
          $pull: { availability: { $eq: new Date('2024-12-01') } },
        }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Volunteers successfully assigned to the event.',
      });
    });

    it('should handle server errors', async () => {
      const req = { body: { eventId: '123', volunteerIds: ['v1'] } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Event.findById.mockRejectedValue(new Error('Database error'));

      await assignVolunteersToEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });
});
