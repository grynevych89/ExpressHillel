const validateUserInput = (req, res, next) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).send('Missing required fields: email and password');
  }
  next();
};

export { validateUserInput };
