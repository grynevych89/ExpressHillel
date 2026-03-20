const basicAuth = (req, res, next) => {
  if (process.env.AUTH_ENABLED !== 'true') return next();
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).send('Access denied. No credentials sent.');
  }
  next();
};

export { basicAuth };
