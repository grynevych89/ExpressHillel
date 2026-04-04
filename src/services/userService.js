import bcrypt from 'bcrypt';
import authUsers from '../data/authUsers.js';
import { BCRYPT_SALT_ROUNDS } from '../config.js';

const findByEmail = (email) => authUsers.find(u => u.email === email);

const createUser = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  const user = { id: authUsers.length + 1, email };
  authUsers.push({ ...user, password: hashedPassword });
  return user;
};

export { findByEmail, createUser };
