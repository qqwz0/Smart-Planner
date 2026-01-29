import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';
export declare class TasksController {
    private tasks;
    constructor(tasks: TasksService);
    findAll(user: {
        sub: string;
    }): import("@prisma/client").Prisma.PrismaPromise<({
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
    findOne(user: {
        sub: string;
    }, id: string): Promise<{
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
    create(user: {
        sub: string;
    }, dto: CreateTaskDto): import("@prisma/client").Prisma.Prisma__TaskClient<{
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
    update(user: {
        sub: string;
    }, id: string, dto: UpdateTaskDto): Promise<{
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
    remove(user: {
        sub: string;
    }, id: string): Promise<{
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
