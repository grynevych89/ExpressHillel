import { Router } from 'express';
import { getRoot } from '../controllers/rootController.js';
import { passportAuth } from '../middlewares/index.js';

const router = Router();

router.get('/', getRoot);

router.get('/protected', passportAuth, (req, res) => {
  res.json({ message: 'Welcome to the protected route!', user: req.user });
});

export default router;
