import express from 'express';
import multer from 'multer';
import { submitProject, fetchMySubmissions, fetchAllSubmissions, getMySubmissions, getHackathonSubmissions } from '../controllers/submission.controller.js';
import { verifyToken, isOrganizer } from '../middleware/auth.middleware.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', fetchAllSubmissions);
router.get('/mine', verifyToken, fetchMySubmissions);
router.get('/my-submissions', verifyToken, getMySubmissions);
router.get('/hackathon/:id', verifyToken, isOrganizer, getHackathonSubmissions);
router.post('/', verifyToken, upload.single('file'), submitProject);

export default router;
