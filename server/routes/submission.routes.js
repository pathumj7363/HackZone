import express from 'express';
import multer from 'multer';
import path from 'path';
import { submitProject, fetchMySubmissions, fetchAllSubmissions, getMySubmissions, getHackathonSubmissions } from '../controllers/submission.controller.js';
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

router.get('/', fetchAllSubmissions);
router.get('/mine', verifyToken, fetchMySubmissions);
router.get('/my-submissions', verifyToken, getMySubmissions);
router.get('/hackathon/:id', verifyToken, isOrganizer, getHackathonSubmissions);
router.post('/', verifyToken, upload.single('file'), submitProject);

export default router;
