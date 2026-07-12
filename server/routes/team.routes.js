import express from 'express';
import { createNewTeam, inviteUser, respondToInvite, fetchMyTeam, fetchAllTeams, joinExistingTeam } from '../controllers/team.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', fetchAllTeams);
router.get('/mine', verifyToken, fetchMyTeam);
router.post('/', verifyToken, createNewTeam);
router.post('/join', verifyToken, joinExistingTeam);
router.post('/invite', verifyToken, inviteUser);
router.post('/invite/respond', verifyToken, respondToInvite);

export default router;
