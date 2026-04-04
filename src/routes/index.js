import { Router } from 'express';
import rootRoutes from './rootRoutes.js';
import authorsRoutes from './authorsRoutes.js';
import articlesRoutes from './articlesRoutes.js';
import authRoutes from './authRoutes.js';
import themeRoutes from './themeRoutes.js';

const router = Router();

router.use('/', rootRoutes);
router.use('/authors', authorsRoutes);
router.use('/articles', articlesRoutes);
router.use('/auth', authRoutes);
router.use('/theme', themeRoutes);

export default router;
