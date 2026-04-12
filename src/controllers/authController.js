import bcrypt from 'bcrypt';
import { findByEmail, registerUser } from '../services/userService.js';
import { signToken, setTokenCookie, clearTokenCookie } from '../services/tokenService.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await registerUser(email, password);
  setTokenCookie(res, signToken(user));
  res.status(201).json({ user });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  setTokenCookie(res, signToken(user));
  res.json({ user: { id: user._id, email: user.email } });
});

const logout = (req, res) => {
  clearTokenCookie(res);
  res.json({ message: 'Logged out' });
};

const getMe = (req, res) => {
  res.json({ user: req.user });
};

export { register, login, logout, getMe };
