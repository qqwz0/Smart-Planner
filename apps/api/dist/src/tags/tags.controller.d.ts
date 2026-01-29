import { TagsService } from './tags.service';
declare class CreateTagDto {
    name: string;
}
export declare class TagsController {
    private tags;
    constructor(tags: TagsService);
    findAll(user: {
        sub: string;
    }): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        userId: string;
    }[]>;
    create(user: {
        sub: string;
    }, dto: CreateTagDto): import("@prisma/client").Prisma.Prisma__TagClient<{
        id: string;
        name: string;
        userId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(user: {
        sub: string;
    }, id: string): Promise<{
        id: string;
        name: string;
        userId: string;
    }>;
}
export {};
