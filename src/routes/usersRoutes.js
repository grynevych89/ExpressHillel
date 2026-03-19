import { Router } from 'express';
import { getUsers, createUser, getUserById, updateUser, deleteUser } from '../controllers/usersController.js';
import { basicAuth } from '../middlewares/authMiddleware.js';
import { validateUserInput } from '../middlewares/validateMiddleware.js';

const router = Router();

router.get('/', basicAuth, getUsers);
router.post('/', basicAuth, validateUserInput, createUser);
router.get('/:userId', basicAuth, getUserById);
router.put('/:userId', basicAuth, updateUser);
router.delete('/:userId', basicAuth, deleteUser);

export default router;
