import { Router } from 'express';
import { getRoot } from '../controllers/rootController.js';

const router = Router();

router.get('/', getRoot);

export default router;
