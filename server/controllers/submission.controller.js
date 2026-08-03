import { createSubmission, getMySubmissions as getMySubmissionsModel, getSubmissionsByTeamId, getAllSubmissions, getSubmissionsWithAssignments as getSubmissionsWithAssignmentsModel } from '../models/submission.model.js';
import crypto from 'crypto';

export const submitProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { teamId, hackathonId, title, description, techStack, repoUrl, demoUrl, videoUrl, notes } = req.body;

    const finalTeamId = teamId || null;
    const finalDescription = description || null;
    const finalGithubRepo = repoUrl || null;
    const finalDemoVideoUrl = videoUrl || demoUrl || null;

    let fileUrl = null;
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    if (!hackathonId || !title) {
      return res.status(400).json({ error: 'hackathonId and title are required' });
    }

    const id = crypto.randomUUID();
    const submission = await createSubmission(id, userId, finalTeamId, hackathonId, title, finalDescription, techStack || null, finalGithubRepo, finalDemoVideoUrl, fileUrl, notes || null);

    return res.status(201).json({ message: 'Project submitted successfully', data: submission });
  } catch (error) {
    console.error('[submitProject] Error submitting project:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const fetchMySubmissions = async (req, res) => {
  try {
    const submissions = await getMySubmissionsModel(req.user.id);
    return res.status(200).json(submissions);
  } catch (error) {
    console.error('[fetchMySubmissions] Error fetching submissions:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /submissions/my-submissions
 * Returns all project submissions made by teams the authenticated user belongs to.
 * Enriched with team name via a JOIN on team_members and teams tables.
 * Returns an empty array (not 404) when the user has made no submissions — that is
 * the normal state for new participants and should not be treated as an error by the client.
 */
export const getMySubmissions = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: user ID missing' });
    }

    const submissions = await getMySubmissionsModel(userId);

    return res.status(200).json({ data: submissions });
  } catch (error) {
    console.error('[getMySubmissions] Error fetching submissions:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const fetchAllSubmissions = async (req, res) => {
  try {
    const submissions = await getAllSubmissions();
    return res.status(200).json(submissions);
  } catch (error) {
    console.error('[fetchAllSubmissions] Error fetching submissions:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getHackathonSubmissions = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Hackathon ID is required' });
    }

    const submissions = await getSubmissionsWithAssignmentsModel(id);
    return res.status(200).json({ data: submissions });
  } catch (error) {
    console.error('[getHackathonSubmissions] Error fetching submissions:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
