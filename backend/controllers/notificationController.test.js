const { getFutureUserEvents } = require('./notificationController');
const { getAllEvents } = require('./eventController');

jest.mock('./eventController');

describe('notificationController', () => {
    describe('getFutureUserEvents', () => {
        let req, res;

        beforeEach(() => {
            req = { params: { id: '123' } };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
        });

        it('returns 404 if user is not found', async () => {
            req.params.id = 'nonExistentUser';
            await getFutureUserEvents(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'User not found.' });
        });

        it('returns 404 if user has no event history', async () => {
            const user = { history: [] };
            global.users = { 123: user };

            await getFutureUserEvents(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'User not found.' });
        });

        it('returns 404 if no future events are found', async () => {
            const user = { history: [1, 2] };
            global.users = { 123: user };

            const pastDate = new Date(Date.now() - 86400000);
            getAllEvents.mockResolvedValue([
                { id: 1, date: pastDate },
                { id: 2, date: pastDate },
            ]);

            await getFutureUserEvents(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'User not found.' });
        });

        it('returns 200 with future events', async () => {
            const user = { history: [1, 2] };
            global.users = { 123: user };

            const futureDate = new Date(Date.now() + 86400000);
            getAllEvents.mockResolvedValue([
                { id: 1, date: futureDate },
                { id: 2, date: futureDate },
            ]);

            await getFutureUserEvents(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error:'User not found.'});
        });
    });
});
