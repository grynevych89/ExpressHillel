import { Router } from 'express';
import rootRoutes from './rootRoutes.js';
import usersRoutes from './usersRoutes.js';
import articlesRoutes from './articlesRoutes.js';
import authRoutes from './authRoutes.js';
import themeRoutes from './themeRoutes.js';

const router = Router();

router.use('/', rootRoutes);
router.use('/users', usersRoutes);
router.use('/articles', articlesRoutes);
router.use('/auth', authRoutes);
router.use('/theme', themeRoutes);

export default router;
