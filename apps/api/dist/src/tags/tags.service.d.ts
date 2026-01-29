import { PrismaService } from '../prisma/prisma.service';
export declare class TagsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        userId: string;
    }[]>;
    create(userId: string, name: string): import("@prisma/client").Prisma.Prisma__TagClient<{
        id: string;
        name: string;
        userId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(userId: string, id: string): Promise<{
        id: string;
        name: string;
        userId: string;
    }>;
}
