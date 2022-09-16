import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function create(
  count = 10,
  callback: (prisma: PrismaClient) => Promise<void>,
) {
  for (let i = 1; i <= count; i++) {
    await callback(prisma);
  }
}
