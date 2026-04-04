import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { JWT_SECRET, JWT_EXPIRES, JWT_COOKIE_NAME, JWT_COOKIE_MAX_AGE } from '../config.js';
import { findByEmail, createUser } from '../services/userService.js';

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (await findByEmail(email)) {
      return res.status(409).json({ error: 'User already exists' });
    }
    const user = await createUser(email, password);
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.cookie(JWT_COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax', maxAge: JWT_COOKIE_MAX_AGE });
    res.status(201).json({ user });
  } catch {
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.cookie(JWT_COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax', maxAge: JWT_COOKIE_MAX_AGE });
    res.json({ user: { id: user._id, email: user.email } });
  } catch {
    res.status(500).json({ error: 'Login failed' });
  }
};

const logout = (req, res) => {
  res.clearCookie(JWT_COOKIE_NAME);
  res.json({ message: 'Logged out' });
};

const getMe = (req, res) => {
  res.json({ user: req.user });
};

export { register, login, logout, getMe };
