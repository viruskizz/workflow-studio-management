import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../../features/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../../features/auth/strategies/local/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../features/auth/strategies/jwt/constants';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
