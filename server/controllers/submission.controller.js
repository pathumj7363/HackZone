import { createSubmission } from '../models/submission.model.js';
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
