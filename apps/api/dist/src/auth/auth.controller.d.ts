import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            createdAt: Date;
        };
        token: string;
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
    }>;
}
