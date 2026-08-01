import {
  createAnnouncement as createAnnouncementModel,
  getAnnouncementsByHackathonId,
  getAnnouncementById,
  updateAnnouncement as updateAnnouncementModel,
  deleteAnnouncementById
} from '../models/announcement.model.js';
import { getHackathonById } from '../models/hackathon.model.js';
import crypto from 'crypto';

export const createAnnouncement = async (req, res) => {
  try {
    const { hackathonId, title, content, audience, priority, status } = req.body;
    const organizerId = req.user?.id;

    if (!hackathonId || !title || !content) {
      return res.status(400).json({ error: 'Hackathon ID, title, and content are required' });
    }

    const hackathon = await getHackathonById(hackathonId);
    if (!hackathon || hackathon.organizerId !== organizerId) {
      return res.status(403).json({ error: 'Unauthorized to create announcements for this hackathon' });
    }

    const id = crypto.randomUUID();
    const announcement = await createAnnouncementModel({
      id,
      hackathonId,
      organizerId,
      title,
      content,
      audience: audience || 'all',
      priority: priority || 'normal',
      status: status || 'draft'
    });

    return res.status(201).json({ message: 'Announcement created successfully', data: announcement });
  } catch (error) {
    console.error('[createAnnouncement] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAnnouncementsByHackathon = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    
    // Both participants and organizers might need to see announcements,
    // but right now it's requested for organizers to view and manage them.
    // So we just fetch all for this hackathon.
    
    const announcements = await getAnnouncementsByHackathonId(hackathonId);
    
    return res.status(200).json({ data: announcements });
  } catch (error) {
    console.error('[getAnnouncementsByHackathon] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, audience, priority, status } = req.body;
    const organizerId = req.user?.id;

    const existing = await getAnnouncementById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    if (existing.organizerId !== organizerId) {
      return res.status(403).json({ error: 'Unauthorized to update this announcement' });
    }

    await updateAnnouncementModel(id, { title, content, audience, priority, status });
    return res.status(200).json({ message: 'Announcement updated successfully' });
  } catch (error) {
    console.error('[updateAnnouncement] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const organizerId = req.user?.id;

    const existing = await getAnnouncementById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    if (existing.organizerId !== organizerId) {
      return res.status(403).json({ error: 'Unauthorized to delete this announcement' });
    }

    await deleteAnnouncementById(id);
    return res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('[deleteAnnouncement] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
