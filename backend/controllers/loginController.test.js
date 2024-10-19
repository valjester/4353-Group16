const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { registerUser, loginUser } = require('./loginController');

const app = express();
app.use(bodyParser.json());
app.post('/register', registerUser);
app.post('/login', loginUser);

describe('Login Controller', () => {
    beforeEach(() => {
        // Reset users to ensure tests are isolated
        users = [];
    });

    describe('POST /register', () => {
        test('should register a new user successfully', async () => {
            const response = await request(app)
                .post('/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    confirmPassword: 'password123',
                    role: 'volunteer'
                });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Registration successful. You can now log in.');
        });

        test('should return 400 if fields are missing', async () => {
            const response = await request(app)
                .post('/register')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('All fields are required');
        });

        test('should return 400 if passwords do not match', async () => {
            const response = await request(app)
                .post('/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    confirmPassword: 'differentpassword',
                    role: 'volunteer'
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Passwords do not match');
        });

        test('should return 400 if user already exists', async () => {
            await request(app)
                .post('/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    confirmPassword: 'password123',
                    role: 'volunteer'
                });

            const response = await request(app)
                .post('/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    confirmPassword: 'password123',
                    role: 'volunteer'
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('User already exists');
        });
    });

    describe('POST /login', () => {
        test('should log in successfully with valid credentials', async () => {
            // First register a user
            await request(app)
                .post('/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    confirmPassword: 'password123',
                    role: 'volunteer'
                });

            const response = await request(app)
                .post('/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toMatch(/Logged in as volunteer/);
            expect(response.body.token).toBeDefined();
        });

        test('should return 400 for invalid email', async () => {
            const response = await request(app)
                .post('/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid credentials');
        });

        test('should return 400 for incorrect password', async () => {
            await request(app)
                .post('/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    confirmPassword: 'password123',
                    role: 'volunteer'
                });

            const response = await request(app)
                .post('/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid credentials');
        });
    });
});
