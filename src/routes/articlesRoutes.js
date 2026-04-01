import { Router } from 'express';
import { getArticles, createArticle, getArticleById, updateArticle, deleteArticle } from '../controllers/articlesController.js';
import { jwtAuth } from '../middlewares/jwtMiddleware.js';

const router = Router();

router.get('/', getArticles);
router.post('/', jwtAuth, createArticle);
router.get('/:articleId', getArticleById);
router.put('/:articleId', jwtAuth, updateArticle);
router.delete('/:articleId', jwtAuth, deleteArticle);

export default router;
