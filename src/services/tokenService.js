import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES, JWT_COOKIE_NAME, JWT_COOKIE_MAX_AGE } from '../config.js';

const signToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

const setTokenCookie = (res, token) => {
  res.cookie(JWT_COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax', maxAge: JWT_COOKIE_MAX_AGE });
};

const clearTokenCookie = (res) => res.clearCookie(JWT_COOKIE_NAME);

export { signToken, verifyToken, setTokenCookie, clearTokenCookie };
