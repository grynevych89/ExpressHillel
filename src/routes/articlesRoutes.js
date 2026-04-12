import { Router } from 'express';
import {
  getArticles, getArticleById,
  createArticle, createArticles,
  updateArticle, updateArticles, replaceArticle,
  deleteArticle, deleteArticles,
  getArticlesStream, getArticlesStats,
} from '../controllers/articlesController.js';
import { jwtAuth } from '../middlewares/jwtMiddleware.js';
import { dbCheckMiddleware } from '../middlewares/dbCheckMiddleware.js';

const router = Router();

router.use(dbCheckMiddleware);

router.get('/', getArticles);
router.get('/stream', getArticlesStream);
router.get('/stats', getArticlesStats);
router.get('/:articleId', getArticleById);

router.post('/bulk', jwtAuth, createArticles);
router.post('/', jwtAuth, createArticle);

router.patch('/many', jwtAuth, updateArticles);
router.patch('/:articleId', jwtAuth, updateArticle);
router.put('/:articleId', jwtAuth, replaceArticle);

router.delete('/many', jwtAuth, deleteArticles);
router.delete('/:articleId', jwtAuth, deleteArticle);

export default router;
