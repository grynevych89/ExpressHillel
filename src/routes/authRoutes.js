import { Router } from 'express';
import passport from 'passport';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { passportRegister, passportLogout, passportGetMe } from '../controllers/passportAuthController.js';
import { jwtAuth } from '../middlewares/jwtMiddleware.js';
import { passportAuth } from '../middlewares/index.js';
import { validateFields } from '../middlewares/validateMiddleware.js';

const validateAuth = validateFields(['email', 'password']);

const router = Router();

router.post('/register', validateAuth, register);
router.post('/login', validateAuth, login);
router.post('/logout', logout);
router.get('/me', jwtAuth, getMe);

router.post('/passport/register', validateAuth, passportRegister);
router.post('/passport/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info?.message || 'Invalid email or password' });
    req.login(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      res.json({ user });
    });
  })(req, res, next);
});
router.post('/passport/logout', passportLogout);
router.get('/passport/me', passportAuth, passportGetMe);

export default router;
