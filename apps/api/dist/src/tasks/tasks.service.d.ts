import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';
export declare class TasksService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string): import("@prisma/client").Prisma.PrismaPromise<({
        taskTags: ({
            tag: {
                id: string;
                name: string;
                userId: string;
            };
        } & {
            taskId: string;
            tagId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        priority: import("@prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        updatedAt: Date;
        userId: string;
    })[]>;
    findOne(userId: string, id: string): Promise<{
        taskTags: ({
            tag: {
                id: string;
                name: string;
                userId: string;
            };
        } & {
            taskId: string;
            tagId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        priority: import("@prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        updatedAt: Date;
        userId: string;
    }>;
    create(userId: string, dto: CreateTaskDto): import("@prisma/client").Prisma.Prisma__TaskClient<{
        taskTags: ({
            tag: {
                id: string;
                name: string;
                userId: string;
            };
        } & {
            taskId: string;
            tagId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        priority: import("@prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        updatedAt: Date;
        userId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(userId: string, id: string, dto: UpdateTaskDto): Promise<{
        taskTags: ({
            tag: {
                id: string;
                name: string;
                userId: string;
            };
        } & {
            taskId: string;
            tagId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        priority: import("@prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        updatedAt: Date;
        userId: string;
    }>;
    remove(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        priority: import("@prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        updatedAt: Date;
        userId: string;
    }>;
}
