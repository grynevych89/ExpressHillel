import Article from '../models/Article.js';
import { buildRegexFilter, buildSearchFilter, getStats } from '../services/articleService.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { notFoundError } from '../middlewares/errorHandlers.js';

const getArticles = asyncHandler(async (req, res) => {
  const filter = buildSearchFilter(req.query.search);
  const projection = req.query.fields
    ? req.query.fields.split(',').reduce((acc, f) => ({ ...acc, [f.trim()]: 1 }), {})
    : {};
  const articles = await Article.find(filter, projection);
  res.render('articles/index.ejs', { articles, searchQuery: req.query.search || '' });
});

const getArticleById = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.articleId);
  if (!article) return notFoundError(res, 'Article');
  res.render('articles/detail.ejs', { article });
});

const createArticle = asyncHandler(async (req, res) => {
  const { title, author, date, content } = req.body;
  const article = await Article.create({ title, author, date, content });
  res.status(201).json({ article });
});

const createArticles = asyncHandler(async (req, res) => {
  const articles = await Article.insertMany(req.body);
  res.status(201).json({ inserted: articles.length, articles });
});

const updateArticle = asyncHandler(async (req, res) => {
  const article = await Article.findByIdAndUpdate(
    req.params.articleId,
    { $set: req.body },
    { returnDocument: 'after', runValidators: true }
  );
  if (!article) return notFoundError(res, 'Article');
  res.json({ article });
});

const updateArticles = asyncHandler(async (req, res) => {
  const filter = buildRegexFilter('author', req.query.author);
  const result = await Article.updateMany(filter, { $set: req.body });
  res.json({ matched: result.matchedCount, modified: result.modifiedCount });
});

const replaceArticle = asyncHandler(async (req, res) => {
  const { title, author, date, content } = req.body;
  const article = await Article.findByIdAndUpdate(
    req.params.articleId,
    { title, author, date, content },
    { returnDocument: 'after', overwrite: true, runValidators: true }
  );
  if (!article) return notFoundError(res, 'Article');
  res.json({ article });
});

const deleteArticle = asyncHandler(async (req, res) => {
  const article = await Article.findByIdAndDelete(req.params.articleId);
  if (!article) return notFoundError(res, 'Article');
  res.json({ message: 'Article deleted', article });
});

const deleteArticles = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!ids || !ids.length) return res.status(400).json({ error: 'No ids provided' });
  const result = await Article.deleteMany({ _id: { $in: ids } });
  res.json({ deleted: result.deletedCount });
});

const getArticlesStream = asyncHandler(async (req, res) => {
  const cursor = Article.find(buildSearchFilter(req.query.search)).cursor();
  const articles = [];
  for await (const doc of cursor) {
    articles.push(doc);
  }
  res.json({ total: articles.length, articles });
});

const getArticlesStats = asyncHandler(async (req, res) => {
  res.json(await getStats());
});

export {
  getArticles, getArticleById,
  createArticle, createArticles,
  updateArticle, updateArticles, replaceArticle,
  deleteArticle, deleteArticles,
  getArticlesStream, getArticlesStats,
};
