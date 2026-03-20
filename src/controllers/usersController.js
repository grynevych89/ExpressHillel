import { users } from '../data/users.js';

const getUsers = (req, res) => {
  res.render('users/index.pug', { users });
};

const createUser = (req, res) => {
  res.send('Post users route');
};

const getUserById = (req, res) => {
  const user = users.find(u => u.id === Number(req.params.userId));
  if (!user) return res.status(404).send('User not found');
  res.render('users/detail.pug', { user });
};

const updateUser = (req, res) => {
  res.send(`Put user by Id route: ${req.params.userId}`);
};

const deleteUser = (req, res) => {
  res.send(`Delete user by Id route: ${req.params.userId}`);
};

export { getUsers, createUser, getUserById, updateUser, deleteUser };
