import { PrismaClient } from '@prisma/client';

export class PrismaService extends PrismaClient {
  constructor() {
    super(process.env.NODE_ENV === 'development' ? { log: ['query'] } : {});
  }
}
