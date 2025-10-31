import { Request, Response } from 'express';
import { KakaoAuthService } from '../services/kakao.service';
import { UserService } from '../services/user.service';

const kakaoAuthService = new KakaoAuthService();
const userService = new UserService();

export class AuthController {
  async kakaoLogin(req: Request, res: Response) {
    try {
      const authUrl = kakaoAuthService.getAuthUrl();
      res.json({ url: authUrl });
    } catch (error) {
      res.status(500).json({
        error: '로그인 URL 생성 실패',
      });
    }
  }

  async kakaoCallback(req: Request, res: Response) {
    const { code } = req.query;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        error: '인가 코드가 필요합니다.',
      });
    }

    try {
      const tokenData = await kakaoAuthService.getAccessToken(code);
      const userInfo = await kakaoAuthService.getUserInfo(tokenData.access_token);
      const kakaoId = String(userInfo.id);
      const name = userInfo.kakao_account?.profile?.nickname || '사용자';
      const profileImage =
        userInfo.kakao_account?.profile?.profile_image_url || userInfo.properties?.profile_image;
      const user = await userService.findOrCreateUser(kakaoId, name, profileImage);

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(
        `${frontendUrl}/auth/callback?userId=${user.id}&name=${encodeURIComponent(user.name || '')}`
      );
    } catch (error) {
      console.error('Kakao callback error:', error);
      res.status(500).json({
        error: '카카오 로그인 처리 중 오류 발생',
      });
    }
  }

  async getUserProfile(req: Request, res: Response) {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({
        error: '사용자 ID가 필요합니다.',
      });
    }

    try {
      const user = await userService.findUserById(userId);

      if (!user) {
        return res.status(404).json({
          error: '사용자를 찾을 수 없습니다.',
        });
      }

      res.json({
        id: user.id,
        name: user.name,
        profileImage: user.profileImage,
      });
    } catch (error) {
      res.status(500).json({
        error: '프로필 조회 중 오류 발생',
      });
    }
  }
}
