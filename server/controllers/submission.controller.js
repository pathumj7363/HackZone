import { createSubmission, getMySubmissions, getAllSubmissions } from '../models/submission.model.js';
import crypto from 'crypto';

export const submitProject = async (req, res) => {
  try {
    const { teamId, hackathonId, title, description, githubRepo, demoVideoUrl } = req.body;
    
    if (!teamId || !hackathonId || !title) {
      return res.status(400).json({ error: 'teamId, hackathonId, and title are required' });
    }

    const id = crypto.randomUUID();
    const submission = await createSubmission(id, teamId, hackathonId, title, description, githubRepo, demoVideoUrl);
    
    res.status(201).json({ message: 'Project submitted successfully', data: submission });
  } catch (error) {
    console.error('Error submitting project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const fetchMySubmissions = async (req, res) => {
  try {
    const submissions = await getMySubmissions(req.user.id);
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const fetchAllSubmissions = async (req, res) => {
  try {
    const submissions = await getAllSubmissions();
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
