import pool from '../database/db.js';

/**
 * Custom error thrown when a judge is assigned to a submission that already
 * has an assignment for that judge. Callers can use `instanceof` to detect
 * this specific condition and respond with HTTP 409 Conflict.
 */
export class DuplicateAssignmentError extends Error {
  constructor(judgeId, submissionId) {
    super(`Judge '${judgeId}' is already assigned to submission '${submissionId}'`);
    this.name = 'DuplicateAssignmentError';
    this.judgeId = judgeId;
    this.submissionId = submissionId;
    this.statusCode = 409;
  }
}

/**
 * Submit a new evaluation for a project
 * @param {string} id - Unique identifier for the evaluation
 * @param {string} submissionId - ID of the submission being evaluated
 * @param {string} judgeId - ID of the judge
 * @param {string} hackathonId - ID of the hackathon
 * @param {Object} scores - Object containing innovationScore, technicalComplexityScore, designScore, usabilityScore, feedback
 * @returns {Promise<Object>} The created evaluation
 */
export const createEvaluation = async (id, submissionId, judgeId, hackathonId, scores) => {
  const { innovationScore, technicalComplexityScore, designScore, usabilityScore, feedback } = scores;
  
  const query = `
    INSERT INTO evaluations (
      id, submissionId, judgeId, hackathonId, 
      innovationScore, technicalComplexityScore, designScore, usabilityScore, feedback
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  await pool.query(query, [
    id, submissionId, judgeId, hackathonId, 
    innovationScore, technicalComplexityScore, designScore, usabilityScore, feedback
  ]);
  
  return { id, submissionId, judgeId, hackathonId, ...scores };
};

/**
 * Assign a judge to a submission by inserting a placeholder evaluation row
 * with NULL scores. This establishes the judge–submission relationship before
 * any actual scoring takes place.
 *
 * Constraint checks (in order):
 *   1. Submission must exist and belong to the given hackathon.
 *   2. User must exist with role = 'judge'.
 *   3. No existing assignment for this (judgeId, submissionId) pair
 *      → throws DuplicateAssignmentError (HTTP 409) if one is found.
 *   4. DB-level safety net: catches ER_DUP_ENTRY from the UNIQUE KEY
 *      unique_evaluation (submissionId, judgeId) for concurrent requests
 *      that bypass check 3, and re-throws as DuplicateAssignmentError.
 *
 * @param {string} judgeId      - ID of the judge to assign
 * @param {string} submissionId - ID of the submission to assign the judge to
 * @param {string} hackathonId  - ID of the hackathon the submission belongs to
 * @returns {Promise<{judgeId: string, submissionId: string, hackathonId: string}>}
 * @throws {Error}                   If submission not found or user is not a judge
 * @throws {DuplicateAssignmentError} If the judge is already assigned to the submission
 */
export const assignJudgeToSubmission = async (judgeId, submissionId, hackathonId) => {
  // 1. Validate the submission exists and belongs to the given hackathon
  const [submissionRows] = await pool.query(
    `SELECT id FROM submissions WHERE id = ? AND hackathonId = ?`,
    [submissionId, hackathonId]
  );
  if (submissionRows.length === 0) {
    throw new Error(
      `Submission '${submissionId}' not found in hackathon '${hackathonId}'`
    );
  }

  // 2. Validate the judge exists and holds the 'judge' role
  const [judgeRows] = await pool.query(
    `SELECT id FROM users WHERE id = ? AND role = 'judge'`,
    [judgeId]
  );
  if (judgeRows.length === 0) {
    throw new Error(`User '${judgeId}' is not a valid judge`);
  }

  // 3. Explicit duplicate-assignment check (application-layer constraint)
  //    This gives a clear, typed error rather than a silent DB-level ignore.
  const [existing] = await pool.query(
    `SELECT id FROM evaluations WHERE judgeId = ? AND submissionId = ?`,
    [judgeId, submissionId]
  );
  if (existing.length > 0) {
    throw new DuplicateAssignmentError(judgeId, submissionId);
  }

  // 4. Insert a placeholder row (all scores NULL = assigned but not yet scored).
  //    A DB-level safety net catches ER_DUP_ENTRY for rare concurrent requests
  //    that slip past check 3 and hits the UNIQUE KEY (submissionId, judgeId).
  const id = `${judgeId}_${submissionId}`;
  try {
    await pool.query(
      `INSERT INTO evaluations
         (id, submissionId, judgeId, hackathonId,
          innovationScore, technicalComplexityScore, designScore, usabilityScore, feedback)
       VALUES (?, ?, ?, ?, NULL, NULL, NULL, NULL, NULL)`,
      [id, submissionId, judgeId, hackathonId]
    );
  } catch (err) {
    // Re-wrap DB duplicate-key violation as the typed application error
    if (err.code === 'ER_DUP_ENTRY') {
      throw new DuplicateAssignmentError(judgeId, submissionId);
    }
    throw err;
  }

  return { judgeId, submissionId, hackathonId };
};

/**
 * Custom error thrown when attempting to remove a judge assignment that does
 * not exist. Callers can use `instanceof` to respond with HTTP 404 Not Found.
 */
export class AssignmentNotFoundError extends Error {
  constructor(judgeId, submissionId) {
    super(`No assignment found for judge '${judgeId}' on submission '${submissionId}'`);
    this.name = 'AssignmentNotFoundError';
    this.judgeId = judgeId;
    this.submissionId = submissionId;
    this.statusCode = 404;
  }
}

/**
 * Remove a judge's assignment from a submission by deleting the evaluation row.
 *
 * This only removes the assignment record; any scores stored in that row are
 * also permanently deleted. Task 14 adds a guard that blocks removal when
 * scores are already filled in.
 *
 * Constraint checks (in order):
 *   1. An assignment (judgeId + submissionId) must exist in the evaluations
 *      table → throws AssignmentNotFoundError (HTTP 404) if not found.
 *   2. DELETE targets the exact (judgeId, submissionId) pair so no other
 *      judge's records are accidentally affected.
 *
 * @param {string} judgeId      - ID of the judge to unassign
 * @param {string} submissionId - ID of the submission to remove the judge from
 * @returns {Promise<{removed: true, judgeId: string, submissionId: string}>}
 * @throws {AssignmentNotFoundError} If no assignment exists for this pair
 */
export const removeJudgeFromSubmission = async (judgeId, submissionId) => {
  // 1. Verify the assignment exists before attempting deletion
  const [rows] = await pool.query(
    `SELECT id FROM evaluations WHERE judgeId = ? AND submissionId = ?`,
    [judgeId, submissionId]
  );
  if (rows.length === 0) {
    throw new AssignmentNotFoundError(judgeId, submissionId);
  }

  // 2. Delete the specific assignment row
  await pool.query(
    `DELETE FROM evaluations WHERE judgeId = ? AND submissionId = ?`,
    [judgeId, submissionId]
  );

  return { removed: true, judgeId, submissionId };
};

/**
 * Fetch evaluations for a specific submission
 * @param {string} submissionId 
 * @returns {Promise<Array>} Array of evaluations
 */
export const getEvaluationsBySubmissionId = async (submissionId) => {
  const query = `SELECT * FROM evaluations WHERE submissionId = ?`;
  const [rows] = await pool.query(query, [submissionId]);
  return rows;
};

/**
 * Fetch evaluations made by a specific judge
 * @param {string} judgeId 
 * @returns {Promise<Array>} Array of evaluations
 */
export const getEvaluationsByJudgeId = async (judgeId) => {
  const query = `
    SELECT e.*, 
           s.title as submissionTitle, s.githubRepo, s.demoVideoUrl
    FROM evaluations e
    LEFT JOIN submissions s ON e.submissionId = s.id
    WHERE e.judgeId = ?
  `;
  try {
    const [rows] = await pool.query(query, [judgeId]);
    return rows;
  } catch (err) {
    // Fallback if submissions table is not fully joined or created yet
    if (err.code === 'ER_NO_SUCH_TABLE') {
      const fallbackQuery = `SELECT * FROM evaluations WHERE judgeId = ?`;
      const [rows] = await pool.query(fallbackQuery, [judgeId]);
      return rows;
    }
    throw err;
  }
};

/**
 * Update an existing evaluation
 * @param {string} id - Evaluation ID
 * @param {Object} scores - Object containing innovationScore, technicalComplexityScore, designScore, usabilityScore, feedback
 * @returns {Promise<boolean>} True if updated
 */
export const updateEvaluation = async (id, scores) => {
  const { innovationScore, technicalComplexityScore, designScore, usabilityScore, feedback } = scores;
  
  const query = `
    UPDATE evaluations 
    SET innovationScore = ?, technicalComplexityScore = ?, designScore = ?, usabilityScore = ?, feedback = ?
    WHERE id = ?
  `;
  
  const [result] = await pool.query(query, [
    innovationScore, technicalComplexityScore, designScore, usabilityScore, feedback, id
  ]);
  
  return result.affectedRows > 0;
};

/**
 * Fetch leaderboard data for a hackathon
 * @param {string} hackathonId 
 * @param {string} judgeId 
 * @returns {Promise<Array>} Array of leaderboard entries
 */
export const getLeaderboardData = async (hackathonId, judgeId) => {
  const query = `
    SELECT 
      s.id, s.title, s.githubRepo, s.demoVideoUrl, s.averageScore,
      (SELECT COUNT(*) FROM evaluations e WHERE e.submissionId = s.id AND e.judgeId = ?) as hasEvaluated
    FROM submissions s
    WHERE s.hackathonId = ?
    ORDER BY s.averageScore DESC
  `;
  try {
    const [rows] = await pool.query(query, [judgeId, hackathonId]);
    return rows.map(r => ({ ...r, hasEvaluated: r.hasEvaluated > 0 }));
  } catch (err) {
    if (err.code === 'ER_NO_SUCH_TABLE') {
      return [];
    }
    throw err;
  }
};
