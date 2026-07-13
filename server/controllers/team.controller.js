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

    return res.status(201).json({ message: 'Team created successfully', data: team });
  } catch (error) {
    console.error('[createNewTeam] Error creating team:', error);
    return res.status(500).json({ error: 'Internal server error' });
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

    return res.status(201).json({ message: 'Invite sent successfully', data: invite });
  } catch (error) {
    console.error('[inviteUser] Error inviting user:', error);
    return res.status(500).json({ error: 'Internal server error' });
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
      return res.status(200).json({ message: `Invite ${status}` });
    } else {
      return res.status(404).json({ error: 'Invite not found' });
    }
  } catch (error) {
    console.error('[respondToInvite] Error responding to invite:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const fetchMyTeam = async (req, res) => {
  try {
    const team = await getMyTeamOld(req.user.id);
    if (!team) return res.status(404).json({ error: 'Team not found' });
    return res.status(200).json(team);
  } catch (error) {
    console.error('[fetchMyTeam] Error fetching team:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /teams/my-team
 * Returns the authenticated participant's team, including all member details.
 * Uses the model's getMyTeam query which JOINs team_members and users tables.
 */
export const getMyTeam = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: user ID missing' });
    }

    const team = await getMyTeamOld(userId);

    if (!team) {
      return res.status(404).json({ error: 'No team found for this user' });
    }

    return res.status(200).json({ data: team });
  } catch (error) {
    console.error('[getMyTeam] Error fetching team:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /teams/my-invites
 * Returns all pending team invites sent to the authenticated user's email address.
 * Returns an empty array (not 404) when the user has no pending invites — that is
 * the normal state and should not be treated as an error by the client.
 */
export const getMyInvites = async (req, res) => {
  try {
    const email = req.user.email;

    if (!email) {
      return res.status(401).json({ error: 'Unauthorized: user email missing' });
    }

    const invites = await getPendingInvitesByEmail(email);

    return res.status(200).json({ data: invites });
  } catch (error) {
    console.error('[getMyInvites] Error fetching invites:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const fetchAllTeams = async (req, res) => {
  try {
    const teams = await getAllTeams();
    return res.status(200).json(teams);
  } catch (error) {
    console.error('[fetchAllTeams] Error fetching teams:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const joinExistingTeam = async (req, res) => {
  try {
    const { code } = req.body;
    await joinTeam(code, req.user.id);
    return res.status(200).json({ success: true, message: 'Joined team!' });
  } catch (error) {
    console.error('[joinExistingTeam] Error joining team:', error);
    return res.status(400).json({ error: error.message });
  }
};
