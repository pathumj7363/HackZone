import { getUsersByRole, updateJudgeProfile, searchUsers, updateParticipantProfile, updateOrganizerProfile, getUserById } from '../models/user.model.js';

/**
 * GET /judges
 * Returns a list of judges with optional search filtering and pagination.
 * Query params:
 * - search: string (matches name, email, or occupation/expertiseTags)
 * - page: number (default 1)
 * - limit: number (default 10)
 */
export const getJudges = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    // Fetch all judges from the database
    let judges = await getUsersByRole('judge');

    // 1. Search Filtering
    if (search) {
      const searchLower = search.toLowerCase();
      judges = judges.filter((judge) => {
        // Safe check for fields since JSON parse or nulls might exist
        const nameMatch = judge.name?.toLowerCase().includes(searchLower);
        const emailMatch = judge.email?.toLowerCase().includes(searchLower);
        const occupationMatch = judge.occupation?.toLowerCase().includes(searchLower);

        let tagsMatch = false;
        if (judge.expertiseTags) {
          try {
            // expertiseTags could be a JSON string from DB depending on DB driver
            const tags = typeof judge.expertiseTags === 'string'
              ? JSON.parse(judge.expertiseTags)
              : judge.expertiseTags;
            if (Array.isArray(tags)) {
              tagsMatch = tags.some(tag => tag.toLowerCase().includes(searchLower));
            }
          } catch (e) {
            // Ignore parse errors
          }
        }

        return nameMatch || emailMatch || occupationMatch || tagsMatch;
      });
    }

    // 2. Pagination
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = pageNumber * limitNumber;

    // Omit sensitive data like password_hash before returning
    const safeJudges = judges.map(judge => {
      const { password_hash, ...safeJudge } = judge;
      return safeJudge;
    });

    const paginatedJudges = safeJudges.slice(startIndex, endIndex);

    // Return the response
    return res.status(200).json({
      data: paginatedJudges,
      pagination: {
        totalItems: safeJudges.length,
        currentPage: pageNumber,
        totalPages: Math.ceil(safeJudges.length / limitNumber),
        limit: limitNumber
      }
    });
  } catch (error) {
    console.error('[getJudges] Error fetching judges:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * PUT /profile/judge
 * Updates the current judge's profile
 */
export const updateJudgeProfileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { occupation, expertiseTags, linkedInUrl } = req.body;

    if (req.user.role !== 'judge') {
      return res.status(403).json({ error: 'Only judges can update this profile' });
    }

    const success = await updateJudgeProfile(userId, { occupation, expertiseTags, linkedInUrl });

    if (success) {
      return res.status(200).json({ message: 'Judge profile updated successfully' });
    } else {
      return res.status(400).json({ error: 'Failed to update judge profile' });
    }
  } catch (error) {
    console.error('[updateJudgeProfileController] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /search
 * Searches users by name or email
 */
export const searchUsersController = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.status(200).json({ data: [] });
    }
    const users = await searchUsers(q);
    return res.status(200).json({ data: users });
  } catch (error) {
    console.error('[searchUsersController] Error searching users:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * PUT /profile/participant
 * Updates the current participant's profile
 */
export const updateParticipantProfileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skills, githubUrl, linkedInUrl, bio } = req.body;

    if (req.user.role !== 'participant') {
      return res.status(403).json({ error: 'Only participants can update this profile' });
    }

    const success = await updateParticipantProfile(userId, { skills, githubUrl, linkedInUrl, bio });

    if (success) {
      return res.status(200).json({ message: 'Participant profile updated successfully' });
    } else {
      return res.status(400).json({ error: 'Failed to update participant profile' });
    }
  } catch (error) {
    console.error('[updateParticipantProfileController] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * PUT /profile/organizer
 * Updates the current organizer's profile
 */
export const updateOrganizerProfileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { organizationName, websiteUrl, isVerified } = req.body;

    if (req.user.role !== 'organizer') {
      return res.status(403).json({ error: 'Only organizers can update this profile' });
    }

    const success = await updateOrganizerProfile(userId, { organizationName, websiteUrl, isVerified });

    if (success) {
      return res.status(200).json({ message: 'Organizer profile updated successfully' });
    } else {
      return res.status(400).json({ error: 'Failed to update organizer profile' });
    }
  } catch (error) {
    console.error('[updateOrganizerProfileController] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /profile/me
 * Gets the full profile for the logged in user
 */
export const getMyProfileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { password_hash, ...safeUser } = user;
    
    // Parse JSON fields if necessary
    try { if (safeUser.expertiseTags && typeof safeUser.expertiseTags === 'string') safeUser.expertiseTags = JSON.parse(safeUser.expertiseTags); } catch(e){}
    try { if (safeUser.skills && typeof safeUser.skills === 'string') safeUser.skills = JSON.parse(safeUser.skills); } catch(e){}

    return res.status(200).json({ data: safeUser });
  } catch (error) {
    console.error('[getMyProfileController] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /profile/:id
 * Gets public profile details for a user (no sensitive info)
 */
export const getPublicProfileController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Construct public profile
    const publicProfile = {
      id: user.id,
      name: user.name,
      role: user.role,
      profilePicture: user.profilePicture
    };
    
    // Include role-specific public fields
    if (user.role === 'participant') {
      publicProfile.bio = user.bio;
      publicProfile.githubUrl = user.githubUrl;
      publicProfile.linkedInUrl = user.linkedInUrl;
      try { publicProfile.skills = typeof user.skills === 'string' ? JSON.parse(user.skills) : user.skills; } catch(e){}
    } else if (user.role === 'judge') {
      publicProfile.occupation = user.occupation;
      publicProfile.linkedInUrl = user.linkedInUrl;
      try { publicProfile.expertiseTags = typeof user.expertiseTags === 'string' ? JSON.parse(user.expertiseTags) : user.expertiseTags; } catch(e){}
    } else if (user.role === 'organizer') {
      publicProfile.organizationName = user.organizationName;
      publicProfile.websiteUrl = user.websiteUrl;
      publicProfile.isVerified = user.isVerified;
    }
    
    return res.status(200).json({ data: publicProfile });
  } catch (error) {
    console.error('[getPublicProfileController] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /profile/avatar
 * Uploads a profile picture
 */
export const uploadProfilePictureController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const { updateProfilePicture } = await import('../models/user.model.js');
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    
    const success = await updateProfilePicture(req.user.id, avatarUrl);
    
    if (success) {
      return res.status(200).json({ message: 'Profile picture updated', profilePicture: avatarUrl });
    } else {
      return res.status(400).json({ error: 'Failed to update profile picture' });
    }
  } catch (error) {
    console.error('[uploadProfilePictureController] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
