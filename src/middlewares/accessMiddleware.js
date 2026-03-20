const checkArticleAccess = (req, res, next) => {
  if (process.env.ACCESS_TOKEN_ENABLED !== 'true') return next();
  const accessToken = req.headers['x-access-token'];
  if (!accessToken) {
    return res.status(403).send('Access denied. No access token provided.');
  }
  next();
};

export { checkArticleAccess };
