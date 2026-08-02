import * as NotificationModel from '../models/notification.model.js';

const generateId = () => Date.now().toString() + Math.floor(Math.random() * 1000).toString();

export const getNotifications = async (req, res) => {
  try {
    const notifications = await NotificationModel.getNotificationsByUserId(req.user.id);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const success = await NotificationModel.markNotificationAsRead(req.params.id, req.user.id);
    if (!success) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification as read', error: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await NotificationModel.markAllNotificationsAsRead(req.user.id);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking all notifications as read', error: error.message });
  }
};

export const createNotification = async (req, res) => {
  try {
    const { title, message, type, link } = req.body;
    const notification = {
      id: generateId(),
      userId: req.user.id,
      title,
      message,
      type,
      link
    };
    await NotificationModel.createNotification(notification);
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error: error.message });
  }
};
