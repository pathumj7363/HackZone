import { test, describe, mock, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import pool from '../database/db.js';
import {
  assignJudgeToSubmission,
  removeJudgeFromSubmission,
  DuplicateAssignmentError,
  AssignmentNotFoundError,
  ScoredAssignmentError
} from '../models/evaluation.model.js';

describe('Evaluation Model - Assignment Queries', () => {
  beforeEach(() => {
    mock.method(pool, 'query');
  });

  afterEach(() => {
    mock.restoreAll();
  });

  describe('assignJudgeToSubmission', () => {
    test('should assign judge successfully when all validations pass', async () => {
      // Mock sequence of pool.query calls
      pool.query.mock.mockImplementation(async (sql) => {
        if (sql.includes('FROM submissions')) return [[{ id: 'sub1' }]];
        if (sql.includes('FROM users')) return [[{ id: 'judge1' }]];
        if (sql.includes('SELECT id FROM evaluations')) return [[]]; // No existing assignment
        if (sql.includes('INSERT INTO evaluations')) return [{ affectedRows: 1 }];
        return [[]];
      });

      const result = await assignJudgeToSubmission('judge1', 'sub1', 'hack1');
      
      assert.deepStrictEqual(result, {
        judgeId: 'judge1',
        submissionId: 'sub1',
        hackathonId: 'hack1'
      });
      assert.strictEqual(pool.query.mock.calls.length, 4);
    });

    test('should throw Error if submission does not exist', async () => {
      pool.query.mock.mockImplementation(async (sql) => {
        if (sql.includes('FROM submissions')) return [[]]; // Not found
        return [[]];
      });

      await assert.rejects(
        () => assignJudgeToSubmission('judge1', 'sub1', 'hack1'),
        { message: "Submission 'sub1' not found in hackathon 'hack1'" }
      );
    });

    test('should throw Error if judge does not exist or invalid role', async () => {
      pool.query.mock.mockImplementation(async (sql) => {
        if (sql.includes('FROM submissions')) return [[{ id: 'sub1' }]];
        if (sql.includes('FROM users')) return [[]]; // Not found
        return [[]];
      });

      await assert.rejects(
        () => assignJudgeToSubmission('judge1', 'sub1', 'hack1'),
        { message: "User 'judge1' is not a valid judge" }
      );
    });

    test('should throw DuplicateAssignmentError if assignment already exists (app layer)', async () => {
      pool.query.mock.mockImplementation(async (sql) => {
        if (sql.includes('FROM submissions')) return [[{ id: 'sub1' }]];
        if (sql.includes('FROM users')) return [[{ id: 'judge1' }]];
        if (sql.includes('SELECT id FROM evaluations')) return [[{ id: 'existing_assignment' }]];
        return [[]];
      });

      await assert.rejects(
        () => assignJudgeToSubmission('judge1', 'sub1', 'hack1'),
        DuplicateAssignmentError
      );
    });

    test('should throw DuplicateAssignmentError if DB throws ER_DUP_ENTRY', async () => {
      pool.query.mock.mockImplementation(async (sql) => {
        if (sql.includes('FROM submissions')) return [[{ id: 'sub1' }]];
        if (sql.includes('FROM users')) return [[{ id: 'judge1' }]];
        if (sql.includes('SELECT id FROM evaluations')) return [[]]; // passes app layer
        if (sql.includes('INSERT INTO evaluations')) {
          const err = new Error('Duplicate entry');
          err.code = 'ER_DUP_ENTRY';
          throw err;
        }
        return [[]];
      });

      await assert.rejects(
        () => assignJudgeToSubmission('judge1', 'sub1', 'hack1'),
        DuplicateAssignmentError
      );
    });
  });

  describe('removeJudgeFromSubmission', () => {
    test('should remove assignment successfully when no scores are recorded', async () => {
      pool.query.mock.mockImplementation(async (sql) => {
        if (sql.includes('SELECT id,') && sql.includes('FROM evaluations')) {
          return [[{
            id: 'judge1_sub1',
            innovationScore: null,
            technicalComplexityScore: null,
            designScore: null,
            usabilityScore: null
          }]];
        }
        if (sql.includes('DELETE FROM evaluations')) return [{ affectedRows: 1 }];
        return [[]];
      });

      const result = await removeJudgeFromSubmission('judge1', 'sub1');
      assert.deepStrictEqual(result, { removed: true, judgeId: 'judge1', submissionId: 'sub1' });
      assert.strictEqual(pool.query.mock.calls.length, 2);
    });

    test('should throw AssignmentNotFoundError if assignment does not exist', async () => {
      pool.query.mock.mockImplementation(async (sql) => {
        if (sql.includes('SELECT id,') && sql.includes('FROM evaluations')) {
          return [[]];
        }
        return [[]];
      });

      await assert.rejects(
        () => removeJudgeFromSubmission('judge1', 'sub1'),
        AssignmentNotFoundError
      );
    });

    test('should throw ScoredAssignmentError if any scores are recorded', async () => {
      pool.query.mock.mockImplementation(async (sql) => {
        if (sql.includes('SELECT id,') && sql.includes('FROM evaluations')) {
          return [[{
            id: 'judge1_sub1',
            innovationScore: 8,
            technicalComplexityScore: null,
            designScore: 9,
            usabilityScore: null
          }]];
        }
        return [[]];
      });

      await assert.rejects(
        () => removeJudgeFromSubmission('judge1', 'sub1'),
        (err) => {
          assert.ok(err instanceof ScoredAssignmentError);
          assert.deepStrictEqual(err.filledScores, ['innovationScore', 'designScore']);
          assert.strictEqual(err.statusCode, 422);
          return true;
        }
      );
    });
  });
});
