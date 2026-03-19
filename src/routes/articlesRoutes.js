import { Router } from 'express';
import { getArticles, createArticle, getArticleById, updateArticle, deleteArticle } from '../controllers/articlesController.js';

const router = Router();

router.get('/', getArticles);
router.post('/', createArticle);
router.get('/:articleId', getArticleById);
router.put('/:articleId', updateArticle);
router.delete('/:articleId', deleteArticle);

export default router;
