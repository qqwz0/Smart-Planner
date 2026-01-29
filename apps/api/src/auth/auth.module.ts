import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const secret = cfg.getOrThrow<string>('JWT_SECRET');

        const raw = cfg.get<string>('JWT_EXPIRES_IN_SECONDS') ?? '604800';
        const expiresIn = Number(raw);

        if (!Number.isFinite(expiresIn)) {
          throw new Error('JWT_EXPIRES_IN_SECONDS must be a number');
        }

        return {
          secret,
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
