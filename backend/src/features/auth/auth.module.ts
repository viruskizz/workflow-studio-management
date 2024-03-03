import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '@backend/features/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '@backend/features/auth/strategies/local/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@backend/features/auth/strategies/jwt/constants';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
