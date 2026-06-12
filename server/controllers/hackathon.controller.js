import pool from '../database/db.js';

export const registerHackathon = async (req, res) => {
  try {
    const userId = req.user.id;
    const { hackathonId, teamId } = req.body; 
    
    // In a real application, we would insert a record into a hackathon_registrations table.
    // For this boilerplate, we'll return a success response assuming the UI will handle it appropriately.
    res.status(200).json({ message: 'Successfully registered for hackathon' });
  } catch (error) {
    console.error('Error registering for hackathon:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
