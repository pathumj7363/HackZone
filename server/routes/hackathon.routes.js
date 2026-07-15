import express from 'express';
import { registerHackathon, getHackathons, getHackathonDetail, createHackathon } from '../controllers/hackathon.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getHackathons);
router.get('/:id', getHackathonDetail);
router.post('/', verifyToken, createHackathon);
router.post('/register', verifyToken, registerHackathon);

export default router;
