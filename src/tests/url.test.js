const request = require('supertest');
const app = require('../index'); // Certifique-se de que este caminho esteja correto
const sequelize = require('../config/database');
const User = require('../models/user');
const Url = require('../models/url');

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
    expect(res.body).toHaveProperty('shortUrl');
  });

  it('should list user URLs', async () => {
    const res = await request(app)
      .get('/urls')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
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
    expect(res.body).toHaveProperty('originalUrl', 'https://updated.com');
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
