import { TaskPriority, TaskStatus } from '@prisma/client';
export declare class CreateTaskDto {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
    tagIds?: string[];
}
export declare class UpdateTaskDto extends CreateTaskDto {
}
