import { isDbConnected } from '../db.js';

const dbCheckMiddleware = (req, res, next) => {
  if (isDbConnected()) return next();
  res.status(503).render('error.ejs', { message: 'Database unavailable. Please try again later.' });
};

export { dbCheckMiddleware };
