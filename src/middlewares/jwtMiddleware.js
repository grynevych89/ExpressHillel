import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_COOKIE_NAME } from '../config.js';

const jwtAuth = (req, res, next) => {
  if (process.env.AUTH_ENABLED !== 'true') return next();
  const token = req.cookies?.[JWT_COOKIE_NAME] || req.headers['authorization']?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

export { jwtAuth };
