import User from "../models/User.js";
import { ERROR_MESSAGES } from "../config.js";

const findByEmail = async (email) => {
  return User.findByEmail(email).select("+password");
};

const findById = (id) => User.findById(id);

const create = async (email, password) => {
  const user = await User.create({ email, password });
  return user.getPublicProfile();
};

const register = async (email, password) => {
  const existingUser = await findByEmail(email);
  if (existingUser) {
    const err = new Error(ERROR_MESSAGES.USER_EXISTS);
    err.status = 409;
    throw err;
  }
  return create(email, password);
};

const authenticate = async (email, password) => {
  const user = await findByEmail(email);
  if (!user || !(await user.comparePassword(password))) {
    const err = new Error(ERROR_MESSAGES.INVALID_EMAIL);
    err.status = 401;
    throw err;
  }
  return user.getPublicProfile();
};

export { findByEmail, findById, create, register, authenticate };
