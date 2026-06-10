import { updateJudgeProfile } from '../models/user.model.js';

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { occupation, expertiseTags, linkedInUrl } = req.body;

    const success = await updateJudgeProfile(userId, { occupation, expertiseTags, linkedInUrl });
    
    if (success) {
      res.status(200).json({ message: 'Profile updated successfully' });
    } else {
      res.status(400).json({ error: 'Failed to update profile or user is not a judge' });
    }
  } catch (error) {
    console.error('Error updating judge profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
