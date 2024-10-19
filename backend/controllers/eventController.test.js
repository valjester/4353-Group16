const request = require('supertest');
const express = require('express');
const eventController = require('../controllers/eventController');

const app = express();
app.use(express.json());
app.get('/events', eventController.getAllEvents);
app.post('/events', eventController.addEvent);
app.get('/events/saved', eventController.getSavedEvents);

describe('Event Controller', () => {
    beforeEach(() => {
        eventController.savedEvents = [
            {
                id: 1,
                eventName: 'Community Cleanup',
                eventDescription: 'Join us for a day of cleaning up the local park!',
                location: 'Central Park',
                requiredSkills: ['teamwork', 'communication'],
                urgency: 'high',
                eventDate: '2024-10-25',
            },
        ];
    });

    test('GET /events should return all events', async () => {
        const response = await request(app).get('/events');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(eventController.savedEvents);
    });

    test('POST /events should add a new event and return it', async () => {
        const newEvent = {
            eventName: 'Food Drive',
            eventDescription: 'Collecting non-perishable food items.',
            location: 'Community Center',
            requiredSkills: ['organization', 'communication'],
            urgency: 'medium',
            eventDate: '2024-11-15',
        };

        const response = await request(app)
            .post('/events')
            .send(newEvent);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            id: 2,
            ...newEvent,
        });

        const getAllResponse = await request(app).get('/events');
        expect(getAllResponse.body.length).toBe(2);
    });

    test('POST /events should return 400 if required fields are missing', async () => {
        const response = await request(app)
            .post('/events')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'All fields are required' });
    });
});
