import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { JWT_SECRET, JWT_EXPIRES, JWT_COOKIE_NAME, JWT_COOKIE_MAX_AGE, BCRYPT_SALT_ROUNDS } from '../config.js';

const registeredUsers = [];

const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    if (registeredUsers.find(u => u.username === username)) {
      return res.status(409).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const user = { id: registeredUsers.length + 1, username };
    registeredUsers.push({ ...user, password: hashedPassword });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.cookie(JWT_COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax', maxAge: JWT_COOKIE_MAX_AGE });
    res.status(201).json({ user });
  } catch {
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = registeredUsers.find(u => u.username === username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.cookie(JWT_COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax', maxAge: JWT_COOKIE_MAX_AGE });
    res.json({ user: { id: user.id, username: user.username } });
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
