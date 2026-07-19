import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hackzone_super_secret_key');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const isJudge = (req, res, next) => {
  if (req.user && req.user.role === 'judge') {
    next();
  } else {
    return res.status(403).json({ error: 'Access denied. Judge role required.' });
  }
};

export const isOrganizer = (req, res, next) => {
  if (req.user && req.user.role === 'organizer') {
    next();
  } else {
    return res.status(403).json({ error: 'Access denied. Organizer role required.' });
  }
};

export const isJudgeOrOrganizer = (req, res, next) => {
  if (req.user && (req.user.role === 'judge' || req.user.role === 'organizer')) {
    next();
  } else {
    return res.status(403).json({ error: 'Access denied. Judge or Organizer role required.' });
  }
};
