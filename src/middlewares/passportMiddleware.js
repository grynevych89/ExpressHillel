const passportAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Access denied. Please log in.' });
};

export { passportAuth };
