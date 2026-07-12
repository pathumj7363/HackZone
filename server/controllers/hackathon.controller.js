import {
  createHackathon,
  getAllHackathons as getAllHackathonsModel,
  getHackathonById,
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
export const createNewHackathon = async (req, res) => {
  try {
    const { title, description, startDate, endDate, rules, prizes, sponsors, judges } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const id = crypto.randomUUID();
    const organizerId = req.user?.id;

    const hackathon = await createHackathon({
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
    });

    return res.status(201).json({ message: 'Hackathon created', data: hackathon });
  } catch (error) {
    console.error('[createNewHackathon] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
