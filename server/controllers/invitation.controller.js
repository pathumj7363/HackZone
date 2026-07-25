import { 
  createJudgeInvitation, 
  getInvitationsByHackathon, 
  getPendingInvitationsForUser, 
  updateInvitationStatus 
} from '../models/invitation.model.js';
import { findUserByEmail } from '../models/user.model.js';

export const inviteJudge = async (req, res) => {
  try {
    const { hackathonId, email } = req.body;
    if (!hackathonId || !email) {
      return res.status(400).json({ error: 'Hackathon ID and email are required' });
    }

    // Check if user already exists
    const user = await findUserByEmail(email);
    const userId = user && user.role === 'judge' ? user.id : null;

    const invite = await createJudgeInvitation(hackathonId, email, userId);
    return res.status(201).json({ message: 'Invitation sent successfully', data: invite });
  } catch (error) {
    if (error.message.includes('already been sent')) {
      return res.status(409).json({ error: error.message });
    }
    console.error('Error inviting judge:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getHackathonInvitations = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const invites = await getInvitationsByHackathon(hackathonId);
    return res.status(200).json({ data: invites });
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyPendingInvitations = async (req, res) => {
  try {
    const email = req.user.email;
    const userId = req.user.id;
    const invites = await getPendingInvitationsForUser(email, userId);
    return res.status(200).json({ data: invites });
  } catch (error) {
    console.error('Error fetching pending invitations:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const respondToInvitation = async (req, res) => {
  try {
    const { inviteId } = req.params;
    const { status } = req.body;
    const email = req.user.email;
    const userId = req.user.id;

    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ error: 'Status must be accepted or declined' });
    }

    await updateInvitationStatus(inviteId, userId, email, status);
    return res.status(200).json({ message: `Invitation ${status} successfully` });
  } catch (error) {
    if (error.message === 'Invitation not found or unauthorized') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Error responding to invitation:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
