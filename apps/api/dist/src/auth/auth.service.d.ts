import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(email: string, password: string): Promise<{
        user: {
            id: string;
            email: string;
            createdAt: Date;
        };
        token: string;
    }>;
    login(email: string, password: string): Promise<{
        token: string;
    }>;
    private sign;
}
