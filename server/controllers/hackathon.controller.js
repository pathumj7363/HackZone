import { createHackathon, getHackathons, getHackathonById } from '../models/hackathon.model.js';
import crypto from 'crypto';

export const registerHackathon = async (req, res) => {
  try {
    const userId = req.user.id;
    const { hackathonId, teamId } = req.body; 
    
    // UI mock support to real API
    res.status(200).json({ message: 'Successfully registered for hackathon' });
  } catch (error) {
    console.error('Error registering for hackathon:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllHackathons = async (req, res) => {
  try {
    const hackathons = await getHackathons();
    res.status(200).json(hackathons);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getHackathonDetail = async (req, res) => {
  try {
    const hackathon = await getHackathonById(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }
    res.status(200).json(hackathon);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createNewHackathon = async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const id = crypto.randomUUID();
    const hackathon = await createHackathon(id, title, description, startDate, endDate);
    res.status(201).json({ message: 'Hackathon created', data: hackathon });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
