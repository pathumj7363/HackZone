/**
 * participant.api.test.js
 *
 * Controller-level tests for all participant-facing endpoints:
 *   GET /hackathons            → getHackathons
 *   GET /hackathons/:id        → getHackathonDetail
 *   GET /teams/my-team         → getMyTeam
 *   GET /teams/my-invites      → getMyInvites
 *   GET /submissions/my-submissions → getMySubmissions
 *
 * Strategy: mock pool.query at the database layer (same pattern as model
 * tests) so controllers call real models which in turn call the mocked pool.
 * This validates the full controller → model → response pipeline without
 * touching the database, matching the project's existing test convention.
 */

import { test, describe, mock, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';

import pool from '../database/db.js';

import { getHackathons, getHackathonDetail } from '../controllers/hackathon.controller.js';
import { getMyTeam, getMyInvites } from '../controllers/team.controller.js';
import { getMySubmissions } from '../controllers/submission.controller.js';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Minimal Express-style req object */
function makeReq({ params = {}, query = {}, body = {}, user = null } = {}) {
  return { params, query, body, user };
}

/** Fake res that captures the last status + json payload */
function makeRes() {
  return {
    _status: null,
    _body: null,
    status(code) { this._status = code; return this; },
    json(body)  { this._body  = body;  return this; },
  };
}

// ─── GET /hackathons → getHackathons ─────────────────────────────────────────

describe('GET /hackathons → getHackathons controller', () => {
  beforeEach(() => mock.method(pool, 'query'));
  afterEach(()  => mock.restoreAll());

  test('returns only published hackathons to unauthenticated callers', async () => {
    const rows = [
      { id: '1', title: 'Hack A', status: 'published' },
      { id: '2', title: 'Hack B', status: 'draft' },
    ];
    pool.query.mock.mockImplementation(async () => [rows]);

    const req = makeReq({ user: null });
    const res = makeRes();
    await getHackathons(req, res);

    assert.strictEqual(res._status, 200);
    assert.strictEqual(res._body.data.length, 1);
    assert.strictEqual(res._body.data[0].id, '1');
  });

  test('returns all hackathons to an organizer with ?all=true', async () => {
    const rows = [
      { id: '1', title: 'Hack A', status: 'published' },
      { id: '2', title: 'Hack B', status: 'draft' },
    ];
    pool.query.mock.mockImplementation(async () => [rows]);

    const req = makeReq({
      user: { id: 'org1', role: 'organizer' },
      query: { all: 'true' },
    });
    const res = makeRes();
    await getHackathons(req, res);

    assert.strictEqual(res._status, 200);
    assert.strictEqual(res._body.data.length, 2);
  });

  test('returns 200 with empty array when no hackathons exist', async () => {
    pool.query.mock.mockImplementation(async () => [[]]);

    const req = makeReq({ user: null });
    const res = makeRes();
    await getHackathons(req, res);

    assert.strictEqual(res._status, 200);
    assert.deepStrictEqual(res._body.data, []);
  });

  test('returns 500 when the database throws', async () => {
    pool.query.mock.mockImplementation(async () => { throw new Error('DB failure'); });

    const req = makeReq();
    const res = makeRes();
    await getHackathons(req, res);

    assert.strictEqual(res._status, 500);
    assert.ok(res._body.error);
  });
});

// ─── GET /hackathons/:id → getHackathonDetail ────────────────────────────────

describe('GET /hackathons/:id → getHackathonDetail controller', () => {
  beforeEach(() => mock.method(pool, 'query'));
  afterEach(()  => mock.restoreAll());

  test('returns 200 with hackathon data when found', async () => {
    const mockHackathon = { id: 'hack1', title: 'Future of Health', status: 'published' };
    pool.query.mock.mockImplementation(async () => [[mockHackathon]]);

    const req = makeReq({ params: { id: 'hack1' } });
    const res = makeRes();
    await getHackathonDetail(req, res);

    assert.strictEqual(res._status, 200);
    assert.deepStrictEqual(res._body.data, mockHackathon);
  });

  test('returns 404 when hackathon is not found', async () => {
    pool.query.mock.mockImplementation(async () => [[]]);

    const req = makeReq({ params: { id: 'non-existent' } });
    const res = makeRes();
    await getHackathonDetail(req, res);

    assert.strictEqual(res._status, 404);
    assert.ok(res._body.error);
  });

  test('returns 500 when the database throws', async () => {
    pool.query.mock.mockImplementation(async () => { throw new Error('DB failure'); });

    const req = makeReq({ params: { id: 'hack1' } });
    const res = makeRes();
    await getHackathonDetail(req, res);

    assert.strictEqual(res._status, 500);
    assert.ok(res._body.error);
  });
});

// ─── GET /teams/my-team → getMyTeam ─────────────────────────────────────────

describe('GET /teams/my-team → getMyTeam controller', () => {
  beforeEach(() => mock.method(pool, 'query'));
  afterEach(()  => mock.restoreAll());

  test('returns 200 with team and members when user belongs to a team', async () => {
    const mockTeam    = { id: 'team1', name: 'Alpha Team', leaderId: 'user1' };
    const mockMembers = [
      { name: 'Alice', email: 'alice@test.com', role: 'leader' },
      { name: 'Bob',   email: 'bob@test.com',   role: 'member' },
    ];

    // getMyTeam model makes two queries: one for the team, one for members
    pool.query.mock.mockImplementation(async (sql) => {
      if (sql.includes('FROM teams t'))        return [[mockTeam]];
      if (sql.includes('FROM team_members tm')) return [mockMembers];
      return [[]];
    });

    const req = makeReq({ user: { id: 'user1', email: 'alice@test.com' } });
    const res = makeRes();
    await getMyTeam(req, res);

    assert.strictEqual(res._status, 200);
    assert.strictEqual(res._body.data.id, 'team1');
    assert.ok(Array.isArray(res._body.data.members));
  });

  test('returns 404 when user is not in any team', async () => {
    pool.query.mock.mockImplementation(async () => [[]]);

    const req = makeReq({ user: { id: 'user2', email: 'nobody@test.com' } });
    const res = makeRes();
    await getMyTeam(req, res);

    assert.strictEqual(res._status, 404);
    assert.ok(res._body.error);
  });

  test('returns 401 when user id is missing from decoded token', async () => {
    const req = makeReq({ user: {} }); // no id field
    const res = makeRes();
    await getMyTeam(req, res);

    assert.strictEqual(res._status, 401);
    assert.ok(res._body.error);
  });

  test('returns 500 when the database throws', async () => {
    pool.query.mock.mockImplementation(async () => { throw new Error('DB failure'); });

    const req = makeReq({ user: { id: 'user1' } });
    const res = makeRes();
    await getMyTeam(req, res);

    assert.strictEqual(res._status, 500);
    assert.ok(res._body.error);
  });
});

// ─── GET /teams/my-invites → getMyInvites ────────────────────────────────────

describe('GET /teams/my-invites → getMyInvites controller', () => {
  beforeEach(() => mock.method(pool, 'query'));
  afterEach(()  => mock.restoreAll());

  test('returns 200 with list of pending invites', async () => {
    const mockInvites = [
      { id: 'inv1', teamId: 'team1', email: 'alice@test.com', status: 'pending' },
    ];
    pool.query.mock.mockImplementation(async () => [mockInvites]);

    const req = makeReq({ user: { id: 'user1', email: 'alice@test.com' } });
    const res = makeRes();
    await getMyInvites(req, res);

    assert.strictEqual(res._status, 200);
    assert.deepStrictEqual(res._body.data, mockInvites);
  });

  test('returns 200 with empty array when user has no pending invites', async () => {
    pool.query.mock.mockImplementation(async () => [[]]);

    const req = makeReq({ user: { id: 'user2', email: 'bob@test.com' } });
    const res = makeRes();
    await getMyInvites(req, res);

    assert.strictEqual(res._status, 200);
    assert.deepStrictEqual(res._body.data, []);
  });

  test('returns 401 when email is missing from decoded token', async () => {
    const req = makeReq({ user: { id: 'user3' } }); // no email field
    const res = makeRes();
    await getMyInvites(req, res);

    assert.strictEqual(res._status, 401);
    assert.ok(res._body.error);
  });

  test('returns 500 when the database throws', async () => {
    pool.query.mock.mockImplementation(async () => { throw new Error('DB failure'); });

    const req = makeReq({ user: { id: 'user1', email: 'alice@test.com' } });
    const res = makeRes();
    await getMyInvites(req, res);

    assert.strictEqual(res._status, 500);
    assert.ok(res._body.error);
  });
});

// ─── GET /submissions/my-submissions → getMySubmissions ──────────────────────

describe('GET /submissions/my-submissions → getMySubmissions controller', () => {
  beforeEach(() => mock.method(pool, 'query'));
  afterEach(()  => mock.restoreAll());

  test('returns 200 with submissions enriched with teamName', async () => {
    const mockRows = [
      { id: 'sub1', title: 'My Project', teamName: 'Alpha Team' },
    ];
    pool.query.mock.mockImplementation(async () => [mockRows]);

    const req = makeReq({ user: { id: 'user1' } });
    const res = makeRes();
    await getMySubmissions(req, res);

    assert.strictEqual(res._status, 200);
    assert.deepStrictEqual(res._body.data, mockRows);
  });

  test('returns 200 with empty array when user has no submissions', async () => {
    pool.query.mock.mockImplementation(async () => [[]]);

    const req = makeReq({ user: { id: 'user2' } });
    const res = makeRes();
    await getMySubmissions(req, res);

    assert.strictEqual(res._status, 200);
    assert.deepStrictEqual(res._body.data, []);
  });

  test('returns 401 when user id is missing from decoded token', async () => {
    const req = makeReq({ user: {} }); // no id field
    const res = makeRes();
    await getMySubmissions(req, res);

    assert.strictEqual(res._status, 401);
    assert.ok(res._body.error);
  });

  test('returns 500 when the database throws', async () => {
    pool.query.mock.mockImplementation(async () => { throw new Error('DB failure'); });

    const req = makeReq({ user: { id: 'user1' } });
    const res = makeRes();
    await getMySubmissions(req, res);

    assert.strictEqual(res._status, 500);
    assert.ok(res._body.error);
  });
});
