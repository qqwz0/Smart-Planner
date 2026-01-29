import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.task.findMany({
      where: { userId },
      include: { taskTags: { include: { tag: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { taskTags: { include: { tag: true } } },
    });
    if (!task || task.userId !== userId) throw new ForbiddenException();
    return task;
  }

  create(userId: string, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        taskTags: dto.tagIds?.length
          ? { createMany: { data: dto.tagIds.map((tagId) => ({ tagId })) } }
          : undefined,
      },
      include: { taskTags: { include: { tag: true } } },
    });
  }

  async update(userId: string, id: string, dto: UpdateTaskDto) {
    await this.findOne(userId, id); // ownership check

    return this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        dueDate: dto.dueDate
          ? new Date(dto.dueDate)
          : dto.dueDate === null
            ? null
            : undefined,
        taskTags: dto.tagIds
          ? {
              deleteMany: {}, // reset links
              createMany: { data: dto.tagIds.map((tagId) => ({ tagId })) },
            }
          : undefined,
      },
      include: { taskTags: { include: { tag: true } } },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.task.delete({ where: { id } });
  }
}
