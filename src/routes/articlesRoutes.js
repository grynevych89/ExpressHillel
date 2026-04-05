import { Router } from 'express';
import {
  getArticles, getArticleById,
  createArticle, createArticles,
  updateArticle, updateArticles, replaceArticle,
  deleteArticle, deleteArticles,
} from '../controllers/articlesController.js';
import { jwtAuth } from '../middlewares/jwtMiddleware.js';

const router = Router();

router.get('/', getArticles);
router.get('/:articleId', getArticleById);

router.post('/bulk', jwtAuth, createArticles);
router.post('/', jwtAuth, createArticle);

router.patch('/many', jwtAuth, updateArticles);
router.patch('/:articleId', jwtAuth, updateArticle);
router.put('/:articleId', jwtAuth, replaceArticle);

router.delete('/many', jwtAuth, deleteArticles);
router.delete('/:articleId', jwtAuth, deleteArticle);

export default router;
