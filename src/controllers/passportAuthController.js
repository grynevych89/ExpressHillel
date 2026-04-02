import { SESSION_COOKIE_NAME } from '../config.js';
import { findByEmail, createUser } from '../services/userService.js';

const passportRegister = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (findByEmail(email)) {
      return res.status(409).json({ error: 'User already exists' });
    }
    const user = await createUser(email, password);
    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: 'Login after registration failed' });
      res.status(201).json({ user });
    });
  } catch {
    res.status(500).json({ error: 'Registration failed' });
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
