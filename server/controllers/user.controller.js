import { getUsersByRole } from '../models/user.model.js';

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
