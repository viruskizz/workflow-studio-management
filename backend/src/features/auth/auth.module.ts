import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '@backend/features/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '@backend/features/auth/strategies/local/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@backend/features/auth/strategies/jwt/constants';
import { FdnetController } from './fdnet/fdnet.controller';
import { FdnetService } from './fdnet/fdnet.service';
import { Auth } from '@backend/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FdnetStrategy } from './strategies/fdnet/fdnet.strategy';
import { HttpModule } from '@nestjs/axios';
import { JwtStrategy } from './strategies/jwt/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth]),
    forwardRef(() => UsersModule),
    // UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
    HttpModule,
  ],
  controllers: [AuthController, FdnetController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    FdnetStrategy,
    FdnetService,
  ],
  exports: [AuthService, FdnetService],
})
export class AuthModule {}
