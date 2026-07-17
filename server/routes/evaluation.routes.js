import express from 'express';
import { 
  getAssignedSubmissions, 
  submitEvaluation, 
  editEvaluation,
  getLeaderboard,
  assignJudge,
  unassignJudge
} from '../controllers/evaluation.controller.js';
import { verifyToken, isJudge, isJudgeOrOrganizer, isOrganizer } from '../middleware/auth.middleware.js';

const router = express.Router();

// All evaluation routes require authentication
router.use(verifyToken);

router.get('/assigned', isJudge, getAssignedSubmissions);
router.post('/', isJudge, submitEvaluation);
router.put('/:id', isJudge, editEvaluation);
router.get('/leaderboard/:hackathonId', isJudgeOrOrganizer, getLeaderboard);

// Organizer-only: assign and unassign judges to submissions
router.post('/assign', isOrganizer, assignJudge);
router.delete('/assign', isOrganizer, unassignJudge);

export default router;
