export const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
export const JWT_EXPIRES = '1h';
export const JWT_COOKIE_NAME = 'token';
export const JWT_COOKIE_MAX_AGE = 60 * 60 * 1000; // 1 hour

export const BCRYPT_SALT_ROUNDS = 10;

export const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-session-secret-change-in-production';
export const SESSION_COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
export const SESSION_COOKIE_NAME = 'connect.sid';

export const THEME_COOKIE_NAME = 'theme';
export const THEME_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days
export const ALLOWED_THEMES = ['light', 'dark'];
