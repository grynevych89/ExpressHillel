const logRequestsMiddleware = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} request to ${req.url}`);
  next();
};

export { logRequestsMiddleware };
