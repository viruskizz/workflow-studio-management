import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { FdnetService } from './fdnet.service';
import { ApiOperation } from '@nestjs/swagger';
import { FdnetAuthGuard } from '../strategies/fdnet/fdnet-auth.guard';
import { AuthService } from '../auth.service';
import { JwtAuthGuard } from '../strategies/jwt/jwt-auth.guard';

@Controller('auth/fdnet')
export class FdnetController {
  constructor(
    private service: FdnetService,
    private authService: AuthService,
  ) {}

  @Get('hello')
  @ApiOperation({ summary: 'Create new project' })
  async hello() {
    return this.service.getHello();
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(FdnetAuthGuard)
  @Post('signin')
  @ApiOperation({ summary: 'Singin user to backend' })
  async signIn(@Request() req) {
    return this.service.signIn(req.user);
  }

  @HttpCode(HttpStatus.OK)
  // @UseGuards(JwtAuthGuard)
  @Post('signup')
  @ApiOperation({ summary: 'Singin user to backend' })
  async signUp(@Body() body) {
    return this.service.signUp(body.username);
  }
}
