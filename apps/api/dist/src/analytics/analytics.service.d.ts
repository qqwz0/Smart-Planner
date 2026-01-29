import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    summary(userId: string): Promise<{
        total: number;
        done: number;
        byStatus: {
            [k: string]: number;
        };
    }>;
}
