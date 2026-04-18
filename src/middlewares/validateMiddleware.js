const validateFields = (requiredFields) => (req, res, next) => {
  const body = req.body || {};
  const missing = requiredFields.filter((field) => !(field in body) || body[field] === null || body[field] === undefined);
  if (missing.length) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
  }
  next();
};

export { validateFields };
