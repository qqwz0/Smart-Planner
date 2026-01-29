import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.tag.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
  }

  create(userId: string, name: string) {
    return this.prisma.tag.create({ data: { userId, name } });
  }

  async remove(userId: string, id: string) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag || tag.userId !== userId) throw new ForbiddenException();
    return this.prisma.tag.delete({ where: { id } });
  }
}
