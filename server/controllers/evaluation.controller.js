import { 
  createEvaluation, 
  getEvaluationsByJudgeId, 
  updateEvaluation,
  getEvaluationsBySubmissionId
} from '../models/evaluation.model.js';
import pool from '../database/db.js';
import crypto from 'crypto';

// Helper to calculate and update average score for a submission
const updateSubmissionAverage = async (submissionId) => {
  try {
    const evals = await getEvaluationsBySubmissionId(submissionId);
    if (evals.length === 0) return;

    let totalScore = 0;
    evals.forEach(e => {
      // Average score per evaluation
      const evalAvg = (e.innovationScore + e.technicalComplexityScore + e.designScore + e.usabilityScore) / 4;
      totalScore += evalAvg;
    });

    const finalAverage = totalScore / evals.length;

    // Try to update submissions table, ignore if it doesn't exist yet
    try {
      await pool.query('UPDATE submissions SET averageScore = ? WHERE id = ?', [finalAverage, submissionId]);
    } catch (err) {
      if (err.code !== 'ER_NO_SUCH_TABLE') throw err;
    }
  } catch (error) {
    console.error('Error calculating submission average:', error);
  }
};

export const getAssignedSubmissions = async (req, res) => {
  try {
    const judgeId = req.user.id;
    const evaluations = await getEvaluationsByJudgeId(judgeId);
    res.status(200).json({ data: evaluations });
  } catch (error) {
    console.error('Error fetching assigned submissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const submitEvaluation = async (req, res) => {
  try {
    const judgeId = req.user.id;
    const { submissionId, hackathonId, scores } = req.body;
    
    if (!submissionId || !hackathonId || !scores) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = crypto.randomUUID();
    const newEval = await createEvaluation(id, submissionId, judgeId, hackathonId, scores);
    
    // Calculate new average asynchronously
    updateSubmissionAverage(submissionId);
    
    res.status(201).json({ message: 'Evaluation submitted successfully', data: newEval });
  } catch (error) {
    console.error('Error submitting evaluation:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Evaluation already exists for this submission by this judge' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const editEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const { scores, submissionId } = req.body;

    const success = await updateEvaluation(id, scores);
    
    if (success) {
      // Calculate new average asynchronously
      if (submissionId) {
        updateSubmissionAverage(submissionId);
      }
      res.status(200).json({ message: 'Evaluation updated successfully' });
    } else {
      res.status(404).json({ error: 'Evaluation not found' });
    }
  } catch (error) {
    console.error('Error updating evaluation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
