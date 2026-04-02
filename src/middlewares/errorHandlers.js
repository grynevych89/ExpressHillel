const notFound = (req, res) => res.status(404).render('404.pug');

const badRequest = (err, req, res, next) => res.status(400).send('Invalid request body');

export { notFound, badRequest };
