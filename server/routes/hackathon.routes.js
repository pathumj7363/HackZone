import express from 'express';
import { registerHackathon, getHackathons, getHackathonDetail, createHackathon, updateHackathon } from '../controllers/hackathon.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getHackathons);
router.get('/:id', getHackathonDetail);
router.post('/', verifyToken, createHackathon);
router.put('/:id', verifyToken, updateHackathon);
router.post('/register', verifyToken, registerHackathon);

export default router;
