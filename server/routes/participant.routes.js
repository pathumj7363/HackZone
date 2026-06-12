import express from 'express';
import { updateProfile } from '../controllers/participant.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.put('/profile', verifyToken, updateProfile);

export default router;
