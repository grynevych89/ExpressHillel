import session from 'express-session';
import { SESSION_SECRET, SESSION_COOKIE_MAX_AGE } from './config.js';

export default session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_COOKIE_MAX_AGE,
  },
});
