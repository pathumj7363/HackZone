import express from 'express';
import { 
  inviteJudge,
  getHackathonInvitations,
  getMyPendingInvitations,
  respondToInvitation
} from '../controllers/invitation.controller.js';
import { verifyToken, isOrganizer, isJudge } from '../middleware/auth.middleware.js';

const router = express.Router();

// Organizer routes
router.post('/', verifyToken, isOrganizer, inviteJudge);
router.get('/hackathon/:hackathonId', verifyToken, isOrganizer, getHackathonInvitations);

// Judge routes
router.get('/me', verifyToken, isJudge, getMyPendingInvitations);
router.patch('/:inviteId/respond', verifyToken, isJudge, respondToInvitation);

export default router;
