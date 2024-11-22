const Event = require('../models/Event');
const { getAllEvents, createEvent, editEvent, getSavedEvents } = require('../controllers/eventController');

jest.mock('../models/Event');

describe('Event Controller', () => {

    describe('getAllEvents', () => {
        it('should return all events', async () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockEvents = [{ eventName: 'Event 1' }, { eventName: 'Event 2' }];
            Event.find.mockResolvedValue(mockEvents);

            await getAllEvents(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockEvents);
        });

        it('should return 500 if there is a server error', async () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Event.find.mockRejectedValue(new Error('Database error'));

            await getAllEvents(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
        });
    });

    describe('createEvent', () => {
        it('should return 400 if required fields are missing', async () => {
            const req = {
                body: {
                    eventName: 'Test Event',
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await createEvent(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required' });
        });

        it('should create an event and return it', async () => {
            const req = {
                body: {
                    eventName: 'Test Event',
                    description: 'Test Description',
                    location: 'Test Location',
                    reqSkills: ['skill1'],
                    urgency: 'High',
                    eventDate: '2024-12-12'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockSavedEvent = {
                eventName: 'Test Event',
                description: 'Test Description',
                location: 'Test Location',
                reqSkills: ['skill1'],
                urgency: 'High',
                eventDate: new Date('2024-12-12')
            };

            Event.prototype.save.mockResolvedValue(mockSavedEvent);

            await createEvent(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockSavedEvent);
        });

        it('should return 500 if there is a server error during event creation', async () => {
            const req = {
                body: {
                    eventName: 'Test Event',
                    description: 'Test Description',
                    location: 'Test Location',
                    reqSkills: ['skill1'],
                    urgency: 'High',
                    eventDate: '2024-12-12'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Event.prototype.save.mockRejectedValue(new Error('Database error'));

            await createEvent(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
        });
    });

    describe('editEvent', () => {
        it('should return 400 if required fields are missing', async () => {
            const req = {
                body: {
                    eventName: 'Updated Event',
                },
                params: { id: '12345' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await editEvent(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required' });
        });

        it('should return 400 if requiredSkills is not an array', async () => {
            const req = {
                body: {
                    eventName: 'Updated Event',
                    eventDescription: 'Updated Description',
                    location: 'Updated Location',
                    requiredSkills: 'not-an-array',
                    urgency: 'High',
                    eventDate: '2024-12-12'
                },
                params: { id: '12345' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await editEvent(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'requiredSkills must be an array' });
        });

        it('should return 404 if event is not found', async () => {
            const req = {
                body: {
                    eventName: 'Updated Event',
                    eventDescription: 'Updated Description',
                    location: 'Updated Location',
                    requiredSkills: ['skill1'],
                    urgency: 'High',
                    eventDate: '2024-12-12'
                },
                params: { id: 'nonexistent-id' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Event.findByIdAndUpdate.mockResolvedValue(null);

            await editEvent(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Event not found' });
        });

        it('should update an event and return it', async () => {
            const req = {
                body: {
                    eventName: 'Updated Event',
                    eventDescription: 'Updated Description',
                    location: 'Updated Location',
                    requiredSkills: ['skill1'],
                    urgency: 'High',
                    eventDate: '2024-12-12'
                },
                params: { id: '12345' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockUpdatedEvent = {
                _id: '12345',
                eventName: 'Updated Event',
                eventDescription: 'Updated Description',
                location: 'Updated Location',
                reqSkills: ['skill1'],
                urgency: 'High',
                eventDate: new Date('2024-12-12')
            };

            Event.findByIdAndUpdate.mockResolvedValue(mockUpdatedEvent);

            await editEvent(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUpdatedEvent);
        });

        it('should return 500 if there is a server error during event update', async () => {
            const req = {
                body: {
                    eventName: 'Updated Event',
                    eventDescription: 'Updated Description',
                    location: 'Updated Location',
                    requiredSkills: ['skill1'],
                    urgency: 'High',
                    eventDate: '2024-12-12'
                },
                params: { id: '12345' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Event.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

            await editEvent(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Server error in editEvent' });
        });
    });

    describe('getSavedEvents', () => {
        it('should return all saved events', async () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Mocking Event.find to return mock data
            const mockEvents = [{ eventName: 'Event 1' }, { eventName: 'Event 2' }];
            Event.find.mockResolvedValue(mockEvents);

            await getSavedEvents(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockEvents);
        });

        it('should return 500 if there is a server error', async () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Mocking Event.find to simulate an error
            Event.find.mockRejectedValue(new Error('Database error'));

            await getSavedEvents(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
        });
    });
});
