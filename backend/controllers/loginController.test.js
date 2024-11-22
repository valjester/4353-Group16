const { registerUser, loginUser } = require('./loginController');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../models/User');

describe('loginController - loginUser', () => {
  it('should login the user and return a token when credentials are correct', async () => {
    const mockUser = { _id: '1', email: 'test@example.com', password: 'hashedPassword', role: 'volunteer' };

    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('mockToken');
    User.findOne.mockResolvedValue(mockUser);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    try {
      await loginUser({ body: { email: 'test@example.com', password: 'password123' } }, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful',
        userId: mockUser._id,
        userProfile: mockUser,
        token: 'mockToken',
      });
    } catch (error) {
      console.error('Error during login:', error);
    }
  });

  it('should return 400 if email or password is missing', async () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await loginUser({ body: { email: 'test@example.com' } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email and password are required.' });
  });

  it('should return 401 if user is not found', async () => {
    User.findOne.mockResolvedValue(null);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await loginUser({ body: { email: 'notfound@example.com', password: 'password123' } }, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials.' });
  });

  it('should return 401 if password does not match', async () => {
    const mockUser = { _id: '1', email: 'test@example.com', password: 'hashedPassword', role: 'volunteer' };

    bcrypt.compare.mockResolvedValue(false);
    User.findOne.mockResolvedValue(mockUser);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await loginUser({ body: { email: 'test@example.com', password: 'wrongpassword' } }, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials.' });
  });

  it('should return 500 if JWT_SECRET is not defined', async () => {
    process.env.JWT_SECRET = '';

    const mockUser = { _id: '1', email: 'test@example.com', password: 'hashedPassword', role: 'volunteer' };
    bcrypt.compare.mockResolvedValue(true);
    User.findOne.mockResolvedValue(mockUser);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await loginUser({ body: { email: 'test@example.com', password: 'password123' } }, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error.' });
  });

  it('should return 500 if an unexpected error occurs', async () => {
    User.findOne.mockRejectedValue(new Error('Database error'));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await loginUser({ body: { email: 'test@example.com', password: 'password123' } }, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Server error.' });
  });
});

describe('loginController - registerUser', () => {
  it('should return 400 if email is missing', async () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await registerUser({ body: { password: 'password123', role: 'volunteer' } }, res);  // Missing email

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email, password, and role are required.' });
  });

  it('should return 400 if password is missing', async () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await registerUser({ body: { email: 'test@example.com', role: 'volunteer' } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email, password, and role are required.' });
  });

  it('should return 400 if role is missing', async () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await registerUser({ body: { email: 'test@example.com', password: 'password123' } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email, password, and role are required.' });
  });
});


describe('loginController - registerUser', () => {
    it('should return 400 if email is missing', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      await registerUser({ body: { password: 'password123', role: 'volunteer' } }, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email, password, and role are required.' });
    });
  
    it('should return 400 if password is missing', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      await registerUser({ body: { email: 'test@example.com', role: 'volunteer' } }, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email, password, and role are required.' });
    });
  
    it('should return 400 if role is missing', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      await registerUser({ body: { email: 'test@example.com', password: 'password123' } }, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email, password, and role are required.' });
    });
  
    it('should return 400 if email already exists', async () => {
        const duplicateEmailError = new Error('Duplicate email');
        duplicateEmailError.code = 11000;
      
        User.create.mockRejectedValue(duplicateEmailError);
      
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
      
        await registerUser({ body: { email: 'duplicate@example.com', password: 'password123', role: 'volunteer' } }, res);
      
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Email already exists.' });
      });
      
      it('should return 500 for any other server error', async () => {
        const serverError = new Error('Database error');
        User.create.mockRejectedValue(serverError);
      
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
      
        await registerUser({ body: { email: 'error@example.com', password: 'password123', role: 'volunteer' } }, res);
      
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Server error.' });
      });
});