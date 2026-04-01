import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_COOKIE_NAME } from '../config.js';

const currentUserMiddleware = (req, res, next) => {
  const token = req.cookies?.[JWT_COOKIE_NAME];
  if (token) {
    try {
      res.locals.currentUser = jwt.verify(token, JWT_SECRET);
    } catch {
      res.locals.currentUser = null;
    }
  } else {
    res.locals.currentUser = null;
  }
  next();
};

export { currentUserMiddleware };
