import { test, describe, mock, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import pool from '../database/db.js';
import { getAllHackathons, getHackathonById } from '../models/hackathon.model.js';

describe('Hackathon Model Participant Queries', () => {
  beforeEach(() => {
    // Mock the pool.query method before each test
    mock.method(pool, 'query');
  });

  afterEach(() => {
    // Restore the original method after each test
    mock.restoreAll();
  });

  test('getAllHackathons should return a list of hackathons', async () => {
    const mockHackathons = [
      { id: '1', title: 'Global AI Hackathon', status: 'published' },
      { id: '2', title: 'Web3 Innovators', status: 'draft' }
    ];
    
    // The query returns an array where the first element is the rows
    pool.query.mock.mockImplementation(async () => [mockHackathons]);

    const result = await getAllHackathons();
    
    assert.deepStrictEqual(result, mockHackathons);
    assert.strictEqual(pool.query.mock.calls.length, 1);
    
    const callArgs = pool.query.mock.calls[0].arguments;
    assert.ok(callArgs[0].includes('SELECT h.*'));
    assert.ok(callArgs[0].includes('participantCount'));
  });

  test('getHackathonById should return a single hackathon when found', async () => {
    const mockHackathon = { id: '123', title: 'Future of Health', status: 'published' };
    
    pool.query.mock.mockImplementation(async () => [[mockHackathon]]);

    const result = await getHackathonById('123');
    
    assert.deepStrictEqual(result, mockHackathon);
    assert.strictEqual(pool.query.mock.calls.length, 1);
    
    const callArgs = pool.query.mock.calls[0].arguments;
    assert.ok(callArgs[0].includes('SELECT h.*'));
    assert.ok(callArgs[0].includes('participantCount'));
    assert.deepStrictEqual(callArgs[1], ['123']);
  });

  test('getHackathonById should return null when no hackathon is found', async () => {
    // Mock empty rows returned
    pool.query.mock.mockImplementation(async () => [[]]);

    const result = await getHackathonById('non-existent-id');
    
    assert.strictEqual(result, null);
    assert.strictEqual(pool.query.mock.calls.length, 1);
  });
});
