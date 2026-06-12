import express from 'express';
import { registerHackathon } from '../controllers/hackathon.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', verifyToken, registerHackathon);

export default router;
