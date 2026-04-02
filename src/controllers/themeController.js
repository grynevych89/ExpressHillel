import { ALLOWED_THEMES, THEME_COOKIE_NAME, THEME_COOKIE_MAX_AGE } from '../config.js';

const getTheme = (req, res) => {
  const theme = req.cookies[THEME_COOKIE_NAME] || 'light';
  res.json({ theme });
};

const setTheme = (req, res) => {
  const { theme } = req.body;
  if (!ALLOWED_THEMES.includes(theme)) {
    return res.status(400).json({ error: `Invalid theme. Allowed: ${ALLOWED_THEMES.join(', ')}` });
  }
  res.cookie(THEME_COOKIE_NAME, theme, { maxAge: THEME_COOKIE_MAX_AGE, httpOnly: false, sameSite: 'lax' });
  res.json({ message: `Theme set to "${theme}"`, theme });
};

export { getTheme, setTheme };
