import * as articleService from "../services/articleService.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { notFoundError } from "../middlewares/errorHandlers.js";
import { ERROR_MESSAGES } from "../config.js";

const getArticles = asyncHandler(async (req, res) => {
  const projection = req.query.fields
    ? req.query.fields
        .split(",")
        .reduce((acc, f) => ({ ...acc, [f.trim()]: 1 }), {})
    : {};
  const articles = await articleService.getAll(
    req.query.search || "",
    projection,
  );
  res.render("articles/index.ejs", {
    articles,
    searchQuery: req.query.search || "",
  });
});

const getArticleById = asyncHandler(async (req, res) => {
  const article = await articleService.getById(req.params.articleId);
  if (!article) return notFoundError(res, "Article");
  res.render("articles/detail.ejs", { article });
});

const createArticle = asyncHandler(async (req, res) => {
  const { title, author, date, content } = req.body;
  const article = await articleService.create({ title, author, date, content });
  res.status(201).json({ article });
});

const createArticles = asyncHandler(async (req, res) => {
  const articles = await articleService.createMany(req.body);
  res.status(201).json({ inserted: articles.length, articles });
});

const updateArticle = asyncHandler(async (req, res) => {
  const article = await articleService.updateById(
    req.params.articleId,
    req.body,
  );
  if (!article) return notFoundError(res, "Article");
  res.json({ article });
});

const updateArticles = asyncHandler(async (req, res) => {
  const filter = articleService.buildRegexFilter("author", req.query.author);
  const result = await articleService.updateMany(filter, req.body);
  res.json({ matched: result.matchedCount, modified: result.modifiedCount });
});

const replaceArticle = asyncHandler(async (req, res) => {
  const { title, author, date, content } = req.body;
  const article = await articleService.replaceById(req.params.articleId, {
    title,
    author,
    date,
    content,
  });
  if (!article) return notFoundError(res, "Article");
  res.json({ article });
});

const deleteArticle = asyncHandler(async (req, res) => {
  const article = await articleService.deleteById(req.params.articleId);
  if (!article) return notFoundError(res, "Article");
  res.json({ message: "Article deleted", article });
});

const deleteArticles = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!ids || !ids.length)
    return res.status(400).json({ error: ERROR_MESSAGES.NO_IDS_PROVIDED });
  const result = await articleService.deleteMany(ids);
  res.json({ deleted: result.deletedCount });
});

const getArticlesStream = asyncHandler(async (req, res) => {
  const articles = await articleService.stream(req.query.search || "");
  res.json({ total: articles.length, articles });
});

const getArticlesStats = asyncHandler(async (req, res) => {
  res.json(await articleService.getStats());
});

export {
  getArticles,
  getArticleById,
  createArticle,
  createArticles,
  updateArticle,
  updateArticles,
  replaceArticle,
  deleteArticle,
  deleteArticles,
  getArticlesStream,
  getArticlesStats,
};
