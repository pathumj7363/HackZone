import { updateParticipantProfile } from '../models/user.model.js';

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skills, githubUrl, linkedInUrl, bio } = req.body;
    
    const success = await updateParticipantProfile(userId, { skills, githubUrl, linkedInUrl, bio });
    if (success) {
      res.status(200).json({ message: 'Profile updated successfully' });
    } else {
      res.status(404).json({ error: 'User not found or role is not participant' });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
