import express from 'express';
import { registerHackathon, getHackathons, getHackathonDetail, createHackathon, updateHackathon, getMyHackathons } from '../controllers/hackathon.controller.js';
import { verifyToken, isOrganizer } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getHackathons);
router.get('/my-hackathons', verifyToken, isOrganizer, getMyHackathons);
router.get('/:id', getHackathonDetail);
router.post('/', verifyToken, isOrganizer, createHackathon);
router.put('/:id', verifyToken, isOrganizer, updateHackathon);
router.post('/register', verifyToken, registerHackathon);

export default router;
