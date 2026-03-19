import { Router } from 'express';
import { getArticles, createArticle, getArticleById, updateArticle, deleteArticle } from '../controllers/articlesController.js';
import { checkArticleAccess } from '../middlewares/accessMiddleware.js';

const router = Router();

router.get('/', checkArticleAccess, getArticles);
router.post('/', checkArticleAccess, createArticle);
router.get('/:articleId', checkArticleAccess, getArticleById);
router.put('/:articleId', checkArticleAccess, updateArticle);
router.delete('/:articleId', checkArticleAccess, deleteArticle);

export default router;
