import { Router } from 'express';
import { getUsers, createUser, getUserById, updateUser, deleteUser } from '../controllers/usersController.js';
import { jwtAuth } from '../middlewares/jwtMiddleware.js';
import { validateUserInput } from '../middlewares/validateMiddleware.js';

const router = Router();

router.get('/', getUsers);
router.post('/', jwtAuth, validateUserInput, createUser);
router.get('/:userId', getUserById);
router.put('/:userId', jwtAuth, updateUser);
router.delete('/:userId', jwtAuth, deleteUser);

export default router;
