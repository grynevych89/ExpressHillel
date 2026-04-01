import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { jwtAuth } from '../middlewares/jwtMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', jwtAuth, getMe);

export default router;
