import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

let prisma: PrismaClient | null = null;

function getPrisma(): PrismaClient {
  if (!prisma) {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });
    prisma = new PrismaClient({ adapter });
  }
  return prisma;
}

export async function resetDb() {
  const p = getPrisma();
  await p.taskTag.deleteMany();
  await p.task.deleteMany();
  await p.tag.deleteMany();
  await p.user.deleteMany();
}

export async function disconnectDb() {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
  }
}
