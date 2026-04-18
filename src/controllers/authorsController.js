import { authors } from '../data/authors.js';
import { notFoundError } from '../middlewares/errorHandlers.js';

const getAuthors = (req, res) => {
  res.render('authors/index.pug', { authors });
};

const createAuthor = (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
};

const getAuthorById = (req, res) => {
  const author = authors.find(a => a.id === Number(req.params.authorId));
  if (!author) return notFoundError(res, 'Author');
  res.render('authors/detail.pug', { author });
};

const updateAuthor = (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
};

const deleteAuthor = (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
};

export { getAuthors, createAuthor, getAuthorById, updateAuthor, deleteAuthor };
