import express from 'express';
import multer from 'multer';
import path from 'path';
import { registerHackathon, getHackathons, getHackathonDetail, createHackathon, updateHackathon, getMyHackathons, getMyRegisteredHackathons, getHackathonRegistrations, updateHackathonRegistrationStatus, getOrganizerStats, deleteHackathon } from '../controllers/hackathon.controller.js';
import { verifyToken, isOrganizer } from '../middleware/auth.middleware.js';

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.get('/', getHackathons);
router.get('/my-hackathons', verifyToken, isOrganizer, getMyHackathons);
router.get('/organizer/stats', verifyToken, isOrganizer, getOrganizerStats);
router.get('/participant/registered', verifyToken, getMyRegisteredHackathons);
router.get('/:id', getHackathonDetail);
router.post('/', verifyToken, isOrganizer, upload.single('image'), createHackathon);
router.put('/:id', verifyToken, isOrganizer, upload.single('image'), updateHackathon);
router.delete('/:id', verifyToken, isOrganizer, deleteHackathon);
router.post('/register', verifyToken, upload.single('proposal'), registerHackathon);
router.get('/:id/registrations', verifyToken, isOrganizer, getHackathonRegistrations);
router.put('/:id/registrations/:registrationId/status', verifyToken, isOrganizer, updateHackathonRegistrationStatus);

export default router;
