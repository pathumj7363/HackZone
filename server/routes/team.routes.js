import express from 'express';
import { createNewTeam, inviteUser, respondToInvite } from '../controllers/team.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', verifyToken, createNewTeam);
router.post('/invite', verifyToken, inviteUser);
router.post('/invite/respond', verifyToken, respondToInvite);

export default router;
