import express from 'express';
import { 
  getAssignedSubmissions, 
  submitEvaluation, 
  editEvaluation 
} from '../controllers/evaluation.controller.js';
import { verifyToken, isJudge } from '../middleware/auth.middleware.js';

const router = express.Router();

// All evaluation routes require authentication and Judge role
router.use(verifyToken, isJudge);

router.get('/assigned', getAssignedSubmissions);
router.post('/', submitEvaluation);
router.put('/:id', editEvaluation);

export default router;
