import { articles } from '../data/articles.js';

const getArticles = (req, res) => {
  res.render('articles/index.ejs', { articles });
};

const createArticle = (req, res) => {
  res.send('Post articles route');
};

const getArticleById = (req, res) => {
  const article = articles.find(a => a.id === Number(req.params.articleId));
  if (!article) return res.status(404).send('Article not found');
  res.render('articles/detail.ejs', { article });
};

const updateArticle = (req, res) => {
  res.send(`Put article by Id route: ${req.params.articleId}`);
};

const deleteArticle = (req, res) => {
  res.send(`Delete article by Id route: ${req.params.articleId}`);
};

export { getArticles, createArticle, getArticleById, updateArticle, deleteArticle };
