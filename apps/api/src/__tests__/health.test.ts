import request from 'supertest';
import { app } from '../index';

describe('System routes', () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns health', async () => {
    const response = await request(app.server).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});
