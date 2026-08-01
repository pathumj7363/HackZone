import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';

// We'll use a dynamic email to avoid conflicts across test runs
const suffix = Date.now();
const participantData = {
  name: `Participant ${suffix}`,
  email: `participant${suffix}@test.com`,
  password: 'password123',
  role: 'participant',
};

const BASE_URL = 'http://localhost:5000';
let participantToken = '';

describe('Participant E2E Flow', () => {
  test('1. Register/Login as Participant', async () => {
    // Register
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(participantData),
    });
    
    assert.strictEqual(regRes.status, 201, 'Registration should succeed');
    const regJson = await regRes.json();
    assert.ok(regJson.token, 'Should return a token');
    
    // Login
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: participantData.email,
        password: participantData.password,
      }),
    });
    
    assert.strictEqual(loginRes.status, 200, 'Login should succeed');
    const loginJson = await loginRes.json();
    participantToken = loginJson.token;
    assert.ok(participantToken, 'Login should return a token');
  });

  test('2. See Hackathons', async () => {
    const res = await fetch(`${BASE_URL}/api/hackathons`, {
      headers: { Authorization: `Bearer ${participantToken}` }
    });
    
    assert.strictEqual(res.status, 200, 'Fetching hackathons should succeed');
    const json = await res.json();
    assert.ok(Array.isArray(json.data), 'Hackathons should be an array');
  });

  test('3. Check Invites', async () => {
    const res = await fetch(`${BASE_URL}/api/teams/my-invites`, {
      headers: { Authorization: `Bearer ${participantToken}` }
    });
    
    assert.strictEqual(res.status, 200, 'Fetching invites should succeed');
    const json = await res.json();
    assert.ok(Array.isArray(json.data), 'Invites should be an array');
  });

  test('4. View Submissions', async () => {
    const res = await fetch(`${BASE_URL}/api/submissions/my-submissions`, {
      headers: { Authorization: `Bearer ${participantToken}` }
    });
    
    assert.strictEqual(res.status, 200, 'Fetching submissions should succeed');
    const json = await res.json();
    assert.ok(Array.isArray(json.data), 'Submissions should be an array');
  });
});
