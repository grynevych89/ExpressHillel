import { JWT_COOKIE_NAME } from '../config.js';
import { verifyToken } from '../services/tokenService.js';

const currentUserFromJWT = (req, res, next) => {
  if (!res.locals.currentUser) {
    const token = req.cookies?.[JWT_COOKIE_NAME];
    res.locals.currentUser = token ? verifyToken(token) : null;
  }
  next();
};

export { currentUserFromJWT };
