const request = require('supertest');
const app = require('../routes/routes');
const sequelize = require('../config/database');
const User = require('../models/user');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe('Authentication', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        email: 'test@example.com',
        password: '123456'
      });

    expected(res.statusCode).toBe(200);
    expected(res.body).toHaveProperty('token');
  });

  it('should not register a user with an existing email', async () => {
    await User.create({ email: 'duplicate@example.com', password: '123456' });

    const res = await request(app)
      .post('/register')
      .send({
        email: 'duplicate@example.com',
        password: '123456',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'User already exists');
  });

  it('should authenticate an existing user', async () => {
    await User.create({ email: 'login@example.com', password: '123456' });

    const res = await request(app)
      .post('/login')
      .send({
        email: 'login@example.com',
        password: '123456',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not authenticate with invalid credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'User not found');
  });
});

afterAll(async () => {
  await sequelize.close();
});
