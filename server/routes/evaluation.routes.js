import express from 'express';
import { 
  getAssignedSubmissions, 
  submitEvaluation, 
  editEvaluation,
  getLeaderboard
} from '../controllers/evaluation.controller.js';
import { verifyToken, isJudge, isJudgeOrOrganizer } from '../middleware/auth.middleware.js';

const router = express.Router();

// All evaluation routes require authentication
router.use(verifyToken);

router.get('/assigned', isJudge, getAssignedSubmissions);
router.post('/', isJudge, submitEvaluation);
router.put('/:id', isJudge, editEvaluation);
router.get('/leaderboard/:hackathonId', isJudgeOrOrganizer, getLeaderboard);

export default router;
