import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Prisma, user } from '@prisma/client';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}
  async register(createAuthDto: CreateAuthDto) {
    // 加密用户密码
    const password = await argon2.hash(createAuthDto.password);
    try {
      // prisma创建用户
      const users = await this.prisma.user.create({
        data: {
          email: createAuthDto.email,
          password,
        },
      });
      delete users.password;
      return users;
    } catch (e) {
      // 用户已经存在
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code == 'P2002') {
          return e.meta ? e.meta : e.code;
        }
      }
    }
  }
  // 获得token
  async token({ email, id }: user) {
    return {
      token: await this.jwt.signAsync({
        email,
        sub: id,
      }),
      user: email,
    };
  }
  // 登录接口实现核心逻辑
  async login({ email, password }: CreateAuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    // 密码验证
    const psMatch = await argon2.verify(user.password, password);
    if (!psMatch) throw new ForbiddenException('密码输入错误');

    return this.token(user);
  }
}
