import { test, describe, mock, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import pool from '../database/db.js';
import { 
  getTeamById, 
  getMyTeam, 
  getAllTeams, 
  getTeamByUserId, 
  joinTeam, 
  getPendingInvitesByEmail 
} from '../models/team.model.js';

describe('Team Model Participant Queries', () => {
  beforeEach(() => {
    mock.method(pool, 'query');
  });

  afterEach(() => {
    mock.restoreAll();
  });

  test('getTeamById should return a team when found', async () => {
    const mockTeam = { id: 'team1', name: 'Alpha Team', leaderId: 'user1' };
    pool.query.mock.mockImplementation(async () => [[mockTeam]]);

    const result = await getTeamById('team1');
    
    assert.deepStrictEqual(result, mockTeam);
    assert.strictEqual(pool.query.mock.calls.length, 1);
    
    const callArgs = pool.query.mock.calls[0].arguments;
    assert.strictEqual(callArgs[0], 'SELECT * FROM teams WHERE id = ?');
    assert.deepStrictEqual(callArgs[1], ['team1']);
  });

  test('getTeamById should return null when no team is found', async () => {
    pool.query.mock.mockImplementation(async () => [[]]);

    const result = await getTeamById('non-existent');
    
    assert.strictEqual(result, null);
    assert.strictEqual(pool.query.mock.calls.length, 1);
  });

  test('getMyTeam should return a team with its members', async () => {
    const mockTeam = { id: 'team1', name: 'Alpha Team', leaderId: 'user1' };
    const mockMembers = [
      { name: 'Alice', email: 'alice@example.com', role: 'leader' },
      { name: 'Bob', email: 'bob@example.com', role: 'member' }
    ];
    
    // First query returns team, second query returns members
    pool.query.mock.mockImplementation(async (query) => {
      if (query.includes('FROM teams t')) {
        return [[mockTeam]];
      } else if (query.includes('FROM team_members tm')) {
        return [mockMembers];
      }
      return [[]];
    });

    const result = await getMyTeam('user1');
    
    assert.strictEqual(result.id, 'team1');
    assert.deepStrictEqual(result.members, ['Alice', 'Bob']);
    assert.strictEqual(pool.query.mock.calls.length, 2);
  });

  test('getMyTeam should return null if user is not in a team', async () => {
    pool.query.mock.mockImplementation(async () => [[]]);

    const result = await getMyTeam('user2');
    
    assert.strictEqual(result, null);
    assert.strictEqual(pool.query.mock.calls.length, 1);
  });

  test('getAllTeams should return a list of teams', async () => {
    const mockTeams = [
      { id: '1', name: 'Team A' },
      { id: '2', name: 'Team B' }
    ];
    
    pool.query.mock.mockImplementation(async () => [mockTeams]);

    const result = await getAllTeams();
    
    assert.deepStrictEqual(result, mockTeams);
    assert.strictEqual(pool.query.mock.calls.length, 1);
    const callArgs = pool.query.mock.calls[0].arguments;
    assert.strictEqual(callArgs[0], 'SELECT * FROM teams ORDER BY created_at DESC');
  });

  test('joinTeam should add user as a member if valid code', async () => {
    const mockTeam = { id: 'team-uuid' };
    
    pool.query.mock.mockImplementation(async (query) => {
      if (query.includes('SELECT id FROM teams WHERE name = ? OR id = ?')) {
        return [[mockTeam]];
      } else if (query.includes('INSERT INTO team_members')) {
        return [{ affectedRows: 1 }];
      }
      return [[]];
    });

    const result = await joinTeam('valid-code', 'user2');
    assert.strictEqual(result, true);
    assert.strictEqual(pool.query.mock.calls.length, 2);
  });

  test('joinTeam should throw an error if team code is invalid', async () => {
    pool.query.mock.mockImplementation(async () => [[]]); // No team found

    await assert.rejects(
      async () => await joinTeam('invalid-code', 'user2'),
      { message: 'Invalid team code' }
    );
    assert.strictEqual(pool.query.mock.calls.length, 1);
  });

  test('getTeamByUserId should return a team without members array', async () => {
    const mockTeam = { id: 'team1', name: 'Alpha Team' };
    pool.query.mock.mockImplementation(async () => [[mockTeam]]);

    const result = await getTeamByUserId('user1');
    
    assert.deepStrictEqual(result, mockTeam);
    assert.strictEqual(pool.query.mock.calls.length, 1);
  });

  test('getTeamByUserId should return null if user not in team', async () => {
    pool.query.mock.mockImplementation(async () => [[]]);

    const result = await getTeamByUserId('user3');
    
    assert.strictEqual(result, null);
    assert.strictEqual(pool.query.mock.calls.length, 1);
  });

  test('getPendingInvitesByEmail should return list of pending invites', async () => {
    const mockInvites = [
      { id: 'inv1', teamId: 'team1', email: 'test@test.com', status: 'pending' }
    ];
    pool.query.mock.mockImplementation(async () => [mockInvites]);

    const result = await getPendingInvitesByEmail('test@test.com');
    
    assert.deepStrictEqual(result, mockInvites);
    assert.strictEqual(pool.query.mock.calls.length, 1);
  });
});
