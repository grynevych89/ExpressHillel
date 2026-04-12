import { JWT_COOKIE_NAME } from '../config.js';
import { verifyToken } from '../services/tokenService.js';

const jwtAuth = (req, res, next) => {
  if (process.env.AUTH_ENABLED !== 'true') return next();
  const token = req.cookies?.[JWT_COOKIE_NAME] || req.headers['authorization']?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
  req.user = payload;
  next();
};

export { jwtAuth };
