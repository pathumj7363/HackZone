import express from 'express';
import {
  createAnnouncement,
  getAnnouncementsByHackathon,
  updateAnnouncement,
  deleteAnnouncement
} from '../controllers/announcement.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyToken); // Protect all announcement routes

router.post('/', createAnnouncement);
router.get('/hackathon/:hackathonId', getAnnouncementsByHackathon);
router.put('/:id', updateAnnouncement);
router.delete('/:id', deleteAnnouncement);

export default router;
