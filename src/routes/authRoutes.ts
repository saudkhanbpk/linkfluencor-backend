import { Router } from 'express';
import passport from '../config/passportConfig';
import {
  loginController,
  registerController,
  activateAccountController,
} from '../controllers/authController';
import { generateToken } from '../utils/authUtils';

const router = Router({ mergeParams: true });

router.post('/login', loginController);
router.post('/register', registerController);
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user as string);
    res.redirect(`/?token=${token}`);
  }
);

router.get('/activate/:token', activateAccountController);

export default router;
