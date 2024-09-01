require('dotenv').config();

const request = require('supertest');
const express = require('express');
const sequelize = require('../config/database');
const routes = require('../routes/routes');
const User = require('../models/user');
const Url = require('../models/url');

const app = express();
const PORT = 3001;

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

let token;


beforeAll(async () => {
  await sequelize.sync({ force: true });

  const user = await User.create({ email: 'test@example.com', password: '123456' });

  const res = await request(app)
    .post('/login')
    .send({
      email: 'test@example.com',
      password: '123456',
    });

  token = res.body.token;
  console.log(token);
});

describe('URL Shortening', () => {
  it('should shorten a URL for an authenticated user', async () => {
    const res = await request(app)
      .post('/shorten')
      .set('Authorization', `Bearer ${token}`)
      .send({
        originalUrl: 'https://example.com',
      });

    expect(res.statusCode).toBe(201);
  });

  it('should list user URLs', async () => {
    const res = await request(app)
      .get('/urls')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it('should update a URL', async () => {
    const url = await Url.create({
      originalUrl: 'https://example.com',
      shortUrl: 'short1',
      createdBy: 1,
    });

    const res = await request(app)
      .put(`/urls/${url.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        originalUrl: 'https://updated.com',
      });

    expect(res.statusCode).toBe(200);
  });

  it('should delete a URL logically', async () => {
    const url = await Url.create({
      originalUrl: 'https://example.com',
      shortUrl: 'short2',
      createdBy: 1,
    });

    const res = await request(app)
      .delete(`/urls/${url.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(204);

    const deletedUrl = await Url.findByPk(url.id);
    expect(deletedUrl).toHaveProperty('deletedAt');
  });
});

afterAll(async () => {
  await sequelize.close();
});
