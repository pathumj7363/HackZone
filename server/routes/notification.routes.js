import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead,
  createNotification
} from '../controllers/notification.controller.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.post('/', createNotification);

export default router;
