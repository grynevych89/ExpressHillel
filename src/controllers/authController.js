import { register, authenticate } from "../services/userService.js";
import {
  signToken,
  setTokenCookie,
  clearTokenCookie,
} from "../services/tokenService.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const registerHandler = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await register(email, password);
  setTokenCookie(res, signToken(user));
  res.status(201).json({ user });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await authenticate(email, password);
  setTokenCookie(res, signToken(user));
  res.json({ user });
});

const logout = (req, res) => {
  clearTokenCookie(res);
  res.json({ message: "Logged out" });
};

const getMe = (req, res) => {
  res.json({ user: req.user });
};

export { registerHandler as register, login, logout, getMe };
