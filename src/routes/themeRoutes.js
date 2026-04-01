import { Router } from 'express';
import { getTheme, setTheme } from '../controllers/themeController.js';

const router = Router();

router.get('/', getTheme);
router.post('/', setTheme);

export default router;
