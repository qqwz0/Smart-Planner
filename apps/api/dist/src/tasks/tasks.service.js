"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TasksService = class TasksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(userId) {
        return this.prisma.task.findMany({
            where: { userId },
            include: { taskTags: { include: { tag: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(userId, id) {
        const task = await this.prisma.task.findUnique({
            where: { id },
            include: { taskTags: { include: { tag: true } } },
        });
        if (!task || task.userId !== userId)
            throw new common_1.ForbiddenException();
        return task;
    }
    create(userId, dto) {
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
    async update(userId, id, dto) {
        await this.findOne(userId, id);
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
                        deleteMany: {},
                        createMany: { data: dto.tagIds.map((tagId) => ({ tagId })) },
                    }
                    : undefined,
            },
            include: { taskTags: { include: { tag: true } } },
        });
    }
    async remove(userId, id) {
        await this.findOne(userId, id);
        return this.prisma.task.delete({ where: { id } });
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map