import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

router.get('/kakao', authController.kakaoLogin);
router.get('/kakao/callback', authController.kakaoCallback);
router.get('/profile', authController.getUserProfile);

export default router;
