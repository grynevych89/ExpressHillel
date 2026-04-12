import { SESSION_COOKIE_NAME } from '../config.js';
import { registerUser } from '../services/userService.js';

const passportRegister = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await registerUser(email, password);
    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: 'Login after registration failed' });
      res.status(201).json({ user });
    });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
};

const passportLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie(SESSION_COOKIE_NAME);
      res.json({ message: 'Logged out' });
    });
  });
};

const passportGetMe = (req, res) => {
  res.json({ user: req.user });
};

export { passportRegister, passportLogout, passportGetMe };
