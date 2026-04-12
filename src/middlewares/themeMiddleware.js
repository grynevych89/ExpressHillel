import { THEME_COOKIE_NAME } from '../config.js';

const themeMiddleware = (req, res, next) => {
  res.locals.theme = req.cookies?.[THEME_COOKIE_NAME] || 'light';
  next();
};

export { themeMiddleware };
