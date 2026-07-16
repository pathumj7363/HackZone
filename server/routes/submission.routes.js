import express from 'express';
import { submitProject, fetchMySubmissions, fetchAllSubmissions, getMySubmissions } from '../controllers/submission.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', fetchAllSubmissions);
router.get('/mine', verifyToken, fetchMySubmissions);
router.get('/my-submissions', verifyToken, getMySubmissions);
router.post('/', verifyToken, submitProject);

export default router;
