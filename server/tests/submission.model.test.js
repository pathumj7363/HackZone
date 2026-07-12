import { test, describe, mock, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import pool from '../database/db.js';
import {
  getSubmissionsByTeamId,
  getMySubmissions,
  getAllSubmissions,
} from '../models/submission.model.js';

describe('Submission Model Participant Queries', () => {
  beforeEach(() => {
    mock.method(pool, 'query');
  });

  afterEach(() => {
    mock.restoreAll();
  });

  // ─── getSubmissionsByTeamId ─────────────────────────────────────────────────

  test('getSubmissionsByTeamId should return enriched submissions for a team', async () => {
    const mockRows = [
      {
        id: 'sub1',
        teamId: 'team1',
        hackathonId: 'hack1',
        title: 'AI Climate Solver',
        description: 'An AI solution for climate change',
        githubRepo: 'https://github.com/team1/project',
        demoVideoUrl: 'https://youtube.com/watch?v=abc',
        created_at: '2026-07-01T10:00:00Z',
        hackathonTitle: 'Global AI Hackathon',
        hackathonStatus: 'published',
        hackathonEndDate: '2026-07-15',
      },
    ];

    pool.query.mock.mockImplementation(async () => [mockRows]);

    const result = await getSubmissionsByTeamId('team1');

    assert.deepStrictEqual(result, mockRows);
    assert.strictEqual(pool.query.mock.calls.length, 1);

    const [sql, params] = pool.query.mock.calls[0].arguments;
    assert.ok(sql.includes('FROM submissions s'), 'Query should select from submissions');
    assert.ok(sql.includes('JOIN hackathons h'), 'Query should JOIN hackathons');
    assert.ok(sql.includes('WHERE s.teamId = ?'), 'Query should filter by teamId');
    assert.ok(sql.includes('ORDER BY s.created_at DESC'), 'Query should order by date');
    assert.deepStrictEqual(params, ['team1']);
  });

  test('getSubmissionsByTeamId should return an empty array if team has no submissions', async () => {
    pool.query.mock.mockImplementation(async () => [[]]);

    const result = await getSubmissionsByTeamId('team-no-subs');

    assert.deepStrictEqual(result, []);
    assert.strictEqual(pool.query.mock.calls.length, 1);
  });

  test('getSubmissionsByTeamId should return multiple submissions ordered newest first', async () => {
    const mockRows = [
      { id: 'sub2', teamId: 'team1', title: 'V2 Project', created_at: '2026-07-10T00:00:00Z', hackathonTitle: 'Hack A' },
      { id: 'sub1', teamId: 'team1', title: 'V1 Project', created_at: '2026-07-01T00:00:00Z', hackathonTitle: 'Hack A' },
    ];

    pool.query.mock.mockImplementation(async () => [mockRows]);

    const result = await getSubmissionsByTeamId('team1');

    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].id, 'sub2', 'Newest submission should come first');
    assert.strictEqual(result[1].id, 'sub1');
  });

  // ─── getMySubmissions ───────────────────────────────────────────────────────

  test('getMySubmissions should return submissions with teamName for a user', async () => {
    const mockRows = [
      {
        id: 'sub1',
        teamId: 'team1',
        hackathonId: 'hack1',
        title: 'My Project',
        teamName: 'Alpha Team',
      },
    ];

    pool.query.mock.mockImplementation(async () => [mockRows]);

    const result = await getMySubmissions('user1');

    assert.deepStrictEqual(result, mockRows);
    assert.strictEqual(pool.query.mock.calls.length, 1);

    const [sql, params] = pool.query.mock.calls[0].arguments;
    assert.ok(sql.includes('JOIN team_members tm'), 'Query should JOIN team_members');
    assert.ok(sql.includes('JOIN teams t'), 'Query should JOIN teams');
    assert.ok(sql.includes('WHERE tm.userId = ?'), 'Query should filter by userId');
    assert.deepStrictEqual(params, ['user1']);
  });

  test('getMySubmissions should return an empty array if user has no submissions', async () => {
    pool.query.mock.mockImplementation(async () => [[]]);

    const result = await getMySubmissions('user-no-subs');

    assert.deepStrictEqual(result, []);
    assert.strictEqual(pool.query.mock.calls.length, 1);
  });

  // ─── getAllSubmissions ──────────────────────────────────────────────────────

  test('getAllSubmissions should return all submissions with team names', async () => {
    const mockRows = [
      { id: 'sub1', title: 'Project Alpha', teamName: 'Alpha Team' },
      { id: 'sub2', title: 'Project Beta', teamName: 'Beta Team' },
    ];

    pool.query.mock.mockImplementation(async () => [mockRows]);

    const result = await getAllSubmissions();

    assert.deepStrictEqual(result, mockRows);
    assert.strictEqual(result.length, 2);
    assert.strictEqual(pool.query.mock.calls.length, 1);

    const [sql] = pool.query.mock.calls[0].arguments;
    assert.ok(sql.includes('JOIN teams t'), 'Query should JOIN teams');
    assert.ok(sql.includes('ORDER BY s.created_at DESC'), 'Query should be ordered by date');
  });

  test('getAllSubmissions should return an empty array when no submissions exist', async () => {
    pool.query.mock.mockImplementation(async () => [[]]);

    const result = await getAllSubmissions();

    assert.deepStrictEqual(result, []);
    assert.strictEqual(pool.query.mock.calls.length, 1);
  });
});
