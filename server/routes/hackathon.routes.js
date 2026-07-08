import express from 'express';
import { registerHackathon, getAllHackathons, getHackathonDetail, createNewHackathon } from '../controllers/hackathon.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getAllHackathons);
router.get('/:id', getHackathonDetail);
router.post('/', verifyToken, createNewHackathon);
router.post('/register', verifyToken, registerHackathon);

export default router;
