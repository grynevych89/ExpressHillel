import mongoose from 'mongoose';
import Article from '../models/Article.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

const dbCheck = (res) => {
  if (!isDbConnected()) {
    res.status(503).render('error.ejs', { message: 'Database unavailable. Please try again later.' });
    return false;
  }
  return true;
};

const getArticles = async (req, res) => {
  if (!dbCheck(res)) return;
  try {
    const filter = req.query.search
      ? { title: { $regex: req.query.search, $options: 'i' } }
      : {};
    const projection = req.query.fields
      ? req.query.fields.split(',').reduce((acc, f) => ({ ...acc, [f.trim()]: 1 }), {})
      : {};
    const articles = await Article.find(filter, projection);
    res.render('articles/index.ejs', { articles, searchQuery: req.query.search || '' });
  } catch {
    res.status(500).render('error.ejs', { message: 'Failed to load articles.' });
  }
};

const getArticleById = async (req, res) => {
  if (!dbCheck(res)) return;
  try {
    const article = await Article.findById(req.params.articleId);
    if (!article) return res.status(404).send('Article not found');
    res.render('articles/detail.ejs', { article });
  } catch {
    res.status(500).render('error.ejs', { message: 'Failed to load article.' });
  }
};

const createArticle = async (req, res) => {
  if (!dbCheck(res)) return;
  try {
    const { title, author, date, content } = req.body;
    const article = await Article.create({ title, author, date, content });
    res.status(201).json({ article });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const createArticles = async (req, res) => {
  if (!dbCheck(res)) return;
  try {
    const articles = await Article.insertMany(req.body);
    res.status(201).json({ inserted: articles.length, articles });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateArticle = async (req, res) => {
  if (!dbCheck(res)) return;
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.articleId,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json({ article });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateArticles = async (req, res) => {
  if (!dbCheck(res)) return;
  try {
    const filter = req.query.author
      ? { author: { $regex: req.query.author, $options: 'i' } }
      : {};
    const result = await Article.updateMany(filter, { $set: req.body });
    res.json({ matched: result.matchedCount, modified: result.modifiedCount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const replaceArticle = async (req, res) => {
  if (!dbCheck(res)) return;
  try {
    const { title, author, date, content } = req.body;
    const article = await Article.findByIdAndUpdate(
      req.params.articleId,
      { title, author, date, content },
      { new: true, overwrite: true, runValidators: true }
    );
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json({ article });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteArticle = async (req, res) => {
  if (!dbCheck(res)) return;
  try {
    const article = await Article.findByIdAndDelete(req.params.articleId);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json({ message: 'Article deleted', article });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteArticles = async (req, res) => {
  if (!dbCheck(res)) return;
  try {
    const { ids } = req.body;
    if (!ids || !ids.length) return res.status(400).json({ error: 'No ids provided' });
    const result = await Article.deleteMany({ _id: { $in: ids } });
    res.json({ deleted: result.deletedCount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export {
  getArticles, getArticleById,
  createArticle, createArticles,
  updateArticle, updateArticles, replaceArticle,
  deleteArticle, deleteArticles,
};
