const userController = require('./userController');

const users = {
    123: {
        fullName: "John Doe",
        address1: "123 Main St",
        city: "Houston",
        state: "TX",
        zipcode: "77007",
        skills: ["dataentry"],
        preferences: "None",
        availability: ["2024-12-01T00:00:00Z"],
        history: []
    },
};

describe('User Controller', () => {
    describe('getUserProfile', () => {
        it('should return user data given an ID', async () => {
            const req = { params: { id: '123' } };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

            await userController.getUserProfile(req, res);

            expect(res.json).toHaveBeenCalledWith({ data: users['123'] });
        });

        it('should return 404 error for user not found', async () => {
            const req = { params: { id: '999' } }; //ID that doesn't exist
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

            await userController.getUserProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'User not found.' });
        });
    });

    describe('updateUserProfile', () => {
        it('should update user profile successfully', async () => {
            const req = {
                params: {id:'123'},
                body: {
                    fullName: 'Jane Doe',
                    address1: '456 Main St',
                    address2: '',
                    city: 'Austin',
                    state: 'TX',
                    zipcode: '78701',
                    skills: ['dataentry'],
                    preferences: 'None',
                    availability: ["2024-12-01T00:00:00Z"],
                },
            };
            const res = {json: jest.fn(), status: jest.fn().mockReturnThis()};

            await userController.updateUserProfile(req, res);

            expect(res.json).toHaveBeenCalledWith({
                message: 'Profile updated successfully',
                data: {
                    fullName: 'Jane Doe',
                    address1: '456 Main St',
                    address2: '',
                    city: 'Austin',
                    state: 'TX',
                    zipcode: '78701',
                    skills: ['dataentry'],
                    preferences: 'None',
                    availability: ["2024-12-01T00:00:00Z"],
                },
            });
        });

        it('should return 404 error for user not found during update', async () => {
            const req = {
                params: { id: '999' },
                body: {
                    fullName: 'Random',
                    address1: 'Anywhere',
                    city: 'Houston',
                    state: 'TX',
                    zipcode: '12345',
                    skills: ['outreach'],
                    preferences: 'None',
                    availability: ['2024-11-01T00:00:00Z'],
                },
            };
            const res = {json: jest.fn(), 
                        status: jest.fn().mockReturnThis()
                        };

            await userController.updateUserProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'User not found.' });
        });
        
        it('should return 400 error, invalid input', async () => {
            const req = {
                params: { id: '123' },
                body: { fullName: '', address1: '' },
            };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

            await userController.updateUserProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Full Name must be between 1 and 50 characters.' }); // Expected error message
        });
    });
});