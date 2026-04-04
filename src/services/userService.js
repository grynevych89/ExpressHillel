import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { BCRYPT_SALT_ROUNDS } from '../config.js';

const findByEmail = (email) => User.findOne({ email });

const findById = (id) => User.findById(id);

const createUser = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  const user = await User.create({ email, password: hashedPassword });
  return { id: user._id, email: user.email };
};

export { findByEmail, findById, createUser };
