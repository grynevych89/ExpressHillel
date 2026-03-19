const getUsers = (req, res) => {
  res.send('Get users route');
};

const createUser = (req, res) => {
  res.send('Post users route');
};

const getUserById = (req, res) => {
  res.send(`Get user by Id route: ${req.params.userId}`);
};

const updateUser = (req, res) => {
  res.send(`Put user by Id route: ${req.params.userId}`);
};

const deleteUser = (req, res) => {
  res.send(`Delete user by Id route: ${req.params.userId}`);
};

export { getUsers, createUser, getUserById, updateUser, deleteUser };
