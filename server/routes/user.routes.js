import express from 'express';
import { getJudges } from '../controllers/user.controller.js';
import { verifyToken, isOrganizer } from '../middleware/auth.middleware.js';

const router = express.Router();

// Only organizers can fetch the list of judges
router.get('/judges', verifyToken, isOrganizer, getJudges);

export default router;
