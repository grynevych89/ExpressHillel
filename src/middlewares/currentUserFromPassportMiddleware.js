const currentUserFromPassport = (req, res, next) => {
  if (req.user) res.locals.currentUser = req.user;
  next();
};

export { currentUserFromPassport };
