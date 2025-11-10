import request from 'supertest';
import { app } from '../index';

describe('System routes', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });

  it('returns health', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});
