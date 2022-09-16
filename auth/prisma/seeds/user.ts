import { PrismaClient } from '@prisma/client';
import { Random } from 'mockjs';
import { hash } from 'argon2';
import create from '../helper';

export function user() {
  create(30, async (prisma: PrismaClient) => {
    await prisma.user.create({
      data: {
        email: Random.string(),
        password: 'admin888',
      },
    });
  });
}
