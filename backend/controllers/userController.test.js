const mongoose = require('mongoose');
const { getUserProfile, updateUserProfile } = require('./userController');
const User = require('../models/User');

jest.mock('../models/User');

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: {
        id: 'validUserId',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('getUserProfile', () => {
    it('should return 400 if the user ID is invalid', async () => {
      req.user.id = 'invalidUserId';

      await getUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid user ID format.' });
    });

    it('should return 404 if the user is not found', async () => {
      User.findById.mockResolvedValue(null);

      await getUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found.' });
    });

    it('should return 500 if there is a server error', async () => {
      const errorMessage = 'Database error';
      User.findById.mockRejectedValue(new Error(errorMessage));

      await getUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });

    it('should return the user profile if the user is found', async () => {
      const mockUser = { _id: 'validUserId', email: 'john@example.com', name: 'John Doe' };
      User.findById.mockResolvedValue(mockUser);

      await getUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockUser });
    });
  });

  describe('updateUserProfile', () => {
    it('should return 400 if the user ID is invalid', async () => {
      req.user.id = 'invalidUserId';

      await updateUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid user ID format.' });
    });

    it('should return 404 if the user is not found', async () => {
      User.findByIdAndUpdate.mockResolvedValue(null);

      await updateUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found.' });
    });

    it('should return 500 if there is a server error', async () => {
      const errorMessage = 'Update failed';
      User.findByIdAndUpdate.mockRejectedValue(new Error(errorMessage));

      await updateUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });

    it('should return the updated user if successful', async () => {
      const mockUpdatedUser = { _id: 'validUserId', email: 'john@example.com', name: 'Updated Name' };
      User.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser);

      req.body = { name: 'Updated Name' };

      await updateUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Profile updated successfully',
        data: mockUpdatedUser,
      });
    });
  });
});
