import { authors } from '../data/authors.js';

const getAuthors = (req, res) => {
  res.render('authors/index.pug', { authors });
};

const createAuthor = (req, res) => {
  res.send('Post authors route');
};

const getAuthorById = (req, res) => {
  const author = authors.find(a => a.id === Number(req.params.authorId));
  if (!author) return res.status(404).send('Author not found');
  res.render('authors/detail.pug', { author });
};

const updateAuthor = (req, res) => {
  res.send(`Put author by Id route: ${req.params.authorId}`);
};

const deleteAuthor = (req, res) => {
  res.send(`Delete author by Id route: ${req.params.authorId}`);
};

export { getAuthors, createAuthor, getAuthorById, updateAuthor, deleteAuthor };
