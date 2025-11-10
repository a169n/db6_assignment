import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    reco: {
      executor: 'ramping-arrival-rate',
      startRate: 10,
      timeUnit: '1s',
      preAllocatedVUs: 50,
      stages: [
        { target: 50, duration: '1m' },
        { target: 100, duration: '1m' },
        { target: 0, duration: '30s' }
      ]
    }
  }
};

const BASE_URL = __ENV.API_BASE_URL || 'http://localhost:4000';

export function setup() {
  const loginRes = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ email: 'user1@example.com', password: 'Password123!' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(loginRes, { 'login succeeded': (r) => r.status === 200 });
  const cookie = loginRes.headers['Set-Cookie'];
  return { cookie };
}

export default function (data) {
  const headers = { headers: { Cookie: data.cookie, 'Content-Type': 'application/json' } };
  const recoRes = http.get(`${BASE_URL}/reco?limit=10`, headers);
  check(recoRes, {
    'reco status 200': (r) => r.status === 200,
    'reco p95 < 400ms': (r) => r.timings.duration < 400
  });
  http.get(`${BASE_URL}/search?q=fitness`, headers);
  http.get(`${BASE_URL}/products`, headers);
  sleep(1);
}
