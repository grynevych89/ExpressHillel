import mongoose from 'mongoose';
import Article from '../models/Article.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

const getArticles = async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).render('error.ejs', {
      message: 'Database unavailable. Please try again later.',
    });
  }
  try {
    const articles = await Article.find();
    res.render('articles/index.ejs', { articles });
  } catch {
    res.status(500).render('error.ejs', { message: 'Failed to load articles.' });
  }
};

const createArticle = (req, res) => {
  res.send('Post articles route');
};

const getArticleById = async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).render('error.ejs', {
      message: 'Database unavailable. Please try again later.',
    });
  }
  try {
    const article = await Article.findById(req.params.articleId);
    if (!article) return res.status(404).send('Article not found');
    res.render('articles/detail.ejs', { article });
  } catch {
    res.status(500).render('error.ejs', { message: 'Failed to load article.' });
  }
};

const updateArticle = (req, res) => {
  res.send(`Put article by Id route: ${req.params.articleId}`);
};

const deleteArticle = (req, res) => {
  res.send(`Delete article by Id route: ${req.params.articleId}`);
};

export { getArticles, createArticle, getArticleById, updateArticle, deleteArticle };
