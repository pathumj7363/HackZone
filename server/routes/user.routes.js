import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getJudges, updateJudgeProfileController, searchUsersController, updateParticipantProfileController, updateOrganizerProfileController, getMyProfileController, getPublicProfileController, uploadProfilePictureController } from '../controllers/user.controller.js';
import { verifyToken, isOrganizer, isJudge, isParticipant } from '../middleware/auth.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure avatars directory exists
const avatarDir = path.join(__dirname, '../uploads/avatars');
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarDir);
  },
  filename: (req, file, cb) => {
    cb(null, `avatar-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

const router = express.Router();

// Only organizers can fetch the list of judges
router.get('/judges', verifyToken, isOrganizer, getJudges);

// Profile updates by role
router.put('/profile/judge', verifyToken, isJudge, updateJudgeProfileController);
router.put('/profile/participant', verifyToken, isParticipant, updateParticipantProfileController);
router.put('/profile/organizer', verifyToken, isOrganizer, updateOrganizerProfileController);

// Fetch logged in user's full profile
router.get('/profile/me', verifyToken, getMyProfileController);

// Upload profile picture
router.post('/profile/avatar', verifyToken, upload.single('avatar'), uploadProfilePictureController);

// Fetch a public profile (no role restriction, but must be authenticated to view)
router.get('/profile/:id', verifyToken, getPublicProfileController);

// Search users
router.get('/search', verifyToken, searchUsersController);

export default router;
