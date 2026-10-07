const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

const email = `test_${Date.now()}@dev.com`;

afterAll(async () => {
  await db.query('DELETE FROM users WHERE email=$1', [email]);
  await db.pool.end();
});

describe('Auth', () => {
  test('register → 201 with token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email, password: 'Password@123', firstName: 'Test', lastName: 'User', role: 'JOB_SEEKER',
    });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  test('login → 200 with token', async () => {
    const res = await request(app).post('/api/auth/login').send({ email, password: 'Password@123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('login wrong password → 401', async () => {
    const res = await request(app).post('/api/auth/login').send({ email, password: 'wrong' });
    expect(res.status).toBe(401);
  });

  test('GET /me without token → 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});