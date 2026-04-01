const themeMiddleware = (req, res, next) => {
  res.locals.theme = req.cookies?.theme || 'light';
  next();
};

export { themeMiddleware };
