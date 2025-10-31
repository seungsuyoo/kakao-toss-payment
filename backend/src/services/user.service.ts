import prisma from '../lib/prisma';
import { User } from '@prisma/client';

export class UserService {
  async findOrCreateUser(kakaoId: string, name?: string, profileImage?: string): Promise<User> {
    let user = await prisma.user.findUnique({
      where: { kakaoId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          kakaoId,
          name,
          profileImage,
        },
      });
    }

    return user;
  }

  async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }
}
