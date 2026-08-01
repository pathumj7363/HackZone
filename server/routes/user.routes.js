import express from 'express';
import { getJudges, updateJudgeProfileController, searchUsersController } from '../controllers/user.controller.js';
import { verifyToken, isOrganizer, isJudge } from '../middleware/auth.middleware.js';

const router = express.Router();

// Only organizers can fetch the list of judges
router.get('/judges', verifyToken, isOrganizer, getJudges);

// Judge profile update
router.put('/profile/judge', verifyToken, isJudge, updateJudgeProfileController);

// Search users
router.get('/search', verifyToken, searchUsersController);

export default router;
