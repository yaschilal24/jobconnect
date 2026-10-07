const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

afterAll(async () => { await db.pool.end(); });

describe('Jobs', () => {
  test('GET /api/jobs → paginated list', async () => {
    const res = await request(app).get('/api/jobs?page=1&limit=5');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.meta).toBeDefined();
  });

  test('POST /api/jobs without auth → 401', async () => {
    const res = await request(app).post('/api/jobs').send({ title: 'X' });
    expect(res.status).toBe(401);
  });
});