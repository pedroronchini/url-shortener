require('dotenv').config();

const request = require('supertest');
const express = require('express');
const sequelize = require('../config/database');
const routes = require('../routes/routes');
const User = require('../models/user');

const app = express();
const PORT = 3000;

sequelize.sync().then(() => {
  console.log('Database synchronized');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

app.use(express.json());
app.use(routes);

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

    expect(res.statusCode).toBe(200);
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
  });

  it('should not authenticate with invalid credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toBe(400);
  });
});

afterAll(async () => {
  await sequelize.close();
});
