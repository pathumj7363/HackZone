import express from 'express';
import { createNewTeam, inviteUser, respondToInvite, fetchMyTeam, fetchAllTeams, joinExistingTeam, getMyTeam, getMyInvites, getSentInvites } from '../controllers/team.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', fetchAllTeams);
router.get('/mine', verifyToken, fetchMyTeam);
router.get('/my-team', verifyToken, getMyTeam);
router.get('/my-invites', verifyToken, getMyInvites);
router.post('/', verifyToken, createNewTeam);
router.post('/join', verifyToken, joinExistingTeam);
router.post('/invite', verifyToken, inviteUser);
router.post('/invite/respond', verifyToken, respondToInvite);
router.get('/:teamId/invites', verifyToken, getSentInvites);

export default router;
