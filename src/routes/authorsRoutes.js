import { Router } from 'express';
import { getAuthors, createAuthor, getAuthorById, updateAuthor, deleteAuthor } from '../controllers/authorsController.js';
import { jwtAuth } from '../middlewares/jwtMiddleware.js';
import { validateUserInput } from '../middlewares/validateMiddleware.js';

const router = Router();

router.get('/', getAuthors);
router.post('/', jwtAuth, validateUserInput, createAuthor);
router.get('/:authorId', getAuthorById);
router.put('/:authorId', jwtAuth, updateAuthor);
router.delete('/:authorId', jwtAuth, deleteAuthor);

export default router;
