const notFound = (req, res) => res.status(404).render('404.pug');

const notFoundError = (res, resource = 'Resource') =>
  res.status(404).json({ error: `${resource} not found` });

const handleError = (err, req, res, next) => {
  const status = err.name === 'ValidationError' ? 400 : (err.status || err.statusCode || 500);
  const message = err.message || 'Internal Server Error';
  if (req.method === 'GET' && req.accepts('html') && !req.xhr) {
    return res.status(status).render('error.ejs', { message });
  }
  res.status(status).json({ error: message });
};

export { notFound, handleError, notFoundError };
