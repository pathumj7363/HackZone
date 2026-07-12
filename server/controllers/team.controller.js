import { createTeam, getTeamById, addTeamMember, createTeamInvite, updateTeamInviteStatus, getMyTeam as getMyTeamOld, getAllTeams, joinTeam, getTeamByUserId, getPendingInvitesByEmail } from '../models/team.model.js';
import crypto from 'crypto';

export const createNewTeam = async (req, res) => {
  try {
    const leaderId = req.user.id;
    const { name, hackathonId, maxCapacity } = req.body;

    if (!name || !hackathonId) {
      return res.status(400).json({ error: 'Name and hackathonId are required' });
    }

    const teamId = crypto.randomUUID();
    const team = await createTeam(teamId, name, leaderId, hackathonId, maxCapacity);
    
    res.status(201).json({ message: 'Team created successfully', data: team });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const inviteUser = async (req, res) => {
  try {
    const { teamId, email } = req.body;
    if (!teamId || !email) {
      return res.status(400).json({ error: 'teamId and email are required' });
    }

    const inviteId = crypto.randomUUID();
    const invite = await createTeamInvite(inviteId, teamId, email);

    res.status(201).json({ message: 'Invite sent successfully', data: invite });
  } catch (error) {
    console.error('Error inviting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const respondToInvite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { inviteId, status, teamId } = req.body; // status: 'accepted' or 'rejected'

    if (!inviteId || !status) {
      return res.status(400).json({ error: 'inviteId and status are required' });
    }

    const success = await updateTeamInviteStatus(inviteId, status);
    if (success) {
      if (status === 'accepted') {
        if (teamId) {
          await addTeamMember(teamId, userId, 'member');
        }
      }
      res.status(200).json({ message: `Invite ${status}` });
    } else {
      res.status(404).json({ error: 'Invite not found' });
    }
  } catch (error) {
    console.error('Error responding to invite:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const fetchMyTeam = async (req, res) => {
  try {
    const team = await getMyTeamOld(req.user.id);
    if (!team) return res.status(404).json({ error: 'Team not found' });
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyTeam = async (req, res) => {
  try {
    const team = await getTeamByUserId(req.user.id);
    if (!team) return res.status(404).json({ error: 'Team not found' });
    res.status(200).json({ data: team });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyInvites = async (req, res) => {
  try {
    const invites = await getPendingInvitesByEmail(req.user.email);
    res.status(200).json({ data: invites });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const fetchAllTeams = async (req, res) => {
  try {
    const teams = await getAllTeams();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const joinExistingTeam = async (req, res) => {
  try {
    const { code } = req.body;
    await joinTeam(code, req.user.id);
    res.status(200).json({ success: true, message: 'Joined team!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
