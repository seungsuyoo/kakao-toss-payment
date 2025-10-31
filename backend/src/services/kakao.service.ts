import axios from 'axios';
import { KakaoTokenResponse, KakaoUserInfo } from '../types/kakao.types';

export class KakaoAuthService {
  private readonly clientId: string;
  private readonly redirectUri: string;

  constructor() {
    this.clientId = process.env.KAKAO_REST_API_KEY!;
    this.redirectUri = process.env.KAKAO_REDIRECT_URI!;
  }

  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
    });

    return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
  }

  async getAccessToken(code: string): Promise<KakaoTokenResponse> {
    try {
      const response = await axios.post<KakaoTokenResponse>(
        'https://kauth.kakao.com/oauth/token',
        {
          grant_type: 'authorization_code',
          client_id: this.clientId,
          redirect_uri: this.redirectUri,
          code,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to get access token:', error);
      throw new Error('카카오 토큰 발급 실패');
    }
  }

  async getUserInfo(accessToken: string): Promise<KakaoUserInfo> {
    try {
      const response = await axios.get<KakaoUserInfo>('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to get user info:', error);
      throw new Error('카카오 사용자 정보 조회 실패');
    }
  }
}
