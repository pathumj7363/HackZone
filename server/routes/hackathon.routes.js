import express from 'express';
import multer from 'multer';
import { registerHackathon, getHackathons, getHackathonDetail, createHackathon, updateHackathon, getMyHackathons, getMyRegisteredHackathons, getHackathonRegistrations, updateHackathonRegistrationStatus } from '../controllers/hackathon.controller.js';
import { verifyToken, isOrganizer } from '../middleware/auth.middleware.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', getHackathons);
router.get('/my-hackathons', verifyToken, isOrganizer, getMyHackathons);
router.get('/participant/registered', verifyToken, getMyRegisteredHackathons);
router.get('/:id', getHackathonDetail);
router.post('/', verifyToken, isOrganizer, upload.single('image'), createHackathon);
router.put('/:id', verifyToken, isOrganizer, upload.single('image'), updateHackathon);
router.post('/register', verifyToken, upload.single('proposal'), registerHackathon);
router.get('/:id/registrations', verifyToken, isOrganizer, getHackathonRegistrations);
router.put('/:id/registrations/:registrationId/status', verifyToken, isOrganizer, updateHackathonRegistrationStatus);

export default router;
