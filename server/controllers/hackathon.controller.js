import {
  createHackathon as createHackathonModel,
  getAllHackathons as getAllHackathonsModel,
  getHackathonById,
  updateHackathon as updateHackathonModel,
  getHackathonsByOrganizerId,
} from '../models/hackathon.model.js';
import crypto from 'crypto';

/**
 * GET /hackathons
 * Returns all hackathons. Participants see only published ones.
 * Organizers/admins can pass ?all=true to see every status.
 */
export const getHackathons = async (req, res) => {
  try {
    const all = await getAllHackathonsModel();

    // By default, only expose published hackathons to participants.
    // If the caller is an authenticated organizer/admin and passes ?all=true,
    // return every hackathon (useful for dashboards).
    const isPrivileged = req.user && (req.user.role === 'organizer' || req.user.role === 'admin');
    const showAll = isPrivileged && req.query.all === 'true';

    const hackathons = showAll
      ? all
      : all.filter((h) => h.status === 'published');

    return res.status(200).json({ data: hackathons });
  } catch (error) {
    console.error('[getHackathons] Error fetching hackathons:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /hackathons/:id
 * Returns a single hackathon's full details by ID.
 */
export const getHackathonDetail = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Hackathon ID is required' });
    }

    const hackathon = await getHackathonById(id);

    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }

    return res.status(200).json({ data: hackathon });
  } catch (error) {
    console.error('[getHackathonDetail] Error fetching hackathon:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /hackathons/register
 * Register a participant's team for a hackathon.
 */
export const registerHackathon = async (req, res) => {
  try {
    const userId = req.user.id;
    const { hackathonId, teamId } = req.body;

    if (!hackathonId || !teamId) {
      return res.status(400).json({ error: 'hackathonId and teamId are required' });
    }

    // TODO: persist registration to DB when table is ready
    return res.status(200).json({ message: 'Successfully registered for hackathon' });
  } catch (error) {
    console.error('[registerHackathon] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /hackathons
 * Create a new hackathon (organizer only).
 */
export const createHackathon = async (req, res) => {
  try {
    const { title, description, startDate, endDate, rules, prizes, sponsors, judges, status } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Valid title is required' });
    }
    if (!description || typeof description !== 'string' || description.trim() === '') {
      return res.status(400).json({ error: 'Valid description is required' });
    }
    if (!startDate || isNaN(Date.parse(startDate))) {
      return res.status(400).json({ error: 'Valid startDate is required' });
    }
    if (!endDate || isNaN(Date.parse(endDate))) {
      return res.status(400).json({ error: 'Valid endDate is required' });
    }
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ error: 'endDate must be after startDate' });
    }
    if (prizes && !Array.isArray(prizes)) {
      return res.status(400).json({ error: 'prizes must be an array' });
    }
    if (sponsors && !Array.isArray(sponsors)) {
      return res.status(400).json({ error: 'sponsors must be an array' });
    }
    if (judges && !Array.isArray(judges)) {
      return res.status(400).json({ error: 'judges must be an array' });
    }

    const id = crypto.randomUUID();
    const organizerId = req.user?.id;

    const hackathon = await createHackathonModel({
      id,
      title,
      description,
      startDate,
      endDate,
      rules,
      prizes,
      sponsors,
      judges,
      organizerId,
      status,
    });

    return res.status(201).json({ message: 'Hackathon created', data: hackathon });
  } catch (error) {
    console.error('[createHackathon] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * PUT /hackathons/:id
 * Update an existing hackathon.
 */
export const updateHackathon = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Hackathon ID is required' });
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Update data is required' });
    }

    const hackathon = await getHackathonById(id);
    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }

    if (hackathon.organizerId !== req.user?.id) {
      return res.status(403).json({ error: 'You do not have permission to update this hackathon' });
    }

    const success = await updateHackathonModel(id, updateData);

    if (!success) {
      return res.status(404).json({ error: 'Hackathon not found or no changes made' });
    }

    return res.status(200).json({ message: 'Hackathon updated successfully' });
  } catch (error) {
    console.error('[updateHackathon] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /hackathons/my
 * Get all hackathons created by the logged-in organizer.
 */
export const getMyHackathons = async (req, res) => {
  try {
    const organizerId = req.user?.id;
    if (!organizerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const hackathons = await getHackathonsByOrganizerId(organizerId);

    return res.status(200).json({ data: hackathons });
  } catch (error) {
    console.error('[getMyHackathons] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
