import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async summary(userId: string) {
    const total = await this.prisma.task.count({ where: { userId } });
    const done = await this.prisma.task.count({
      where: { userId, status: TaskStatus.DONE },
    });

    const byStatus = await this.prisma.task.groupBy({
      by: ['status'],
      where: { userId },
      _count: { _all: true },
    });

    return {
      total,
      done,
      byStatus: Object.fromEntries(
        byStatus.map((x) => [x.status, x._count._all]),
      ),
    };
  }
}
