import express from 'express';
import { updateProfile } from '../controllers/judge.controller.js';
import { verifyToken, isJudge } from '../middleware/auth.middleware.js';

const router = express.Router();

router.put('/profile', verifyToken, isJudge, updateProfile);

export default router;
