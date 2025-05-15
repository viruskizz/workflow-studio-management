import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Body,
  Query,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { FdnetService } from './fdnet.service';
import { ApiOperation } from '@nestjs/swagger';
import { FdnetAuthGuard } from '../strategies/fdnet/fdnet-auth.guard';
import { AuthService } from '../auth.service';
import { JwtAuthGuard } from '../strategies/jwt/jwt-auth.guard';
import { query } from 'express';

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
  @UseGuards(JwtAuthGuard)
  @Post('signup')
  @ApiOperation({ summary: 'Singin user to backend' })
  async signUp(@Body() body) {
    return this.service.signUp(body.username);
  }

  @HttpCode(HttpStatus.OK)
  // @UseGuards(JwtAuthGuard)
  @Get('users/:username')
  @ApiOperation({ summary: 'get single user' })
  async getUser(@Param('username') username: string) {
    return this.service.getUser(username);
  }
}
