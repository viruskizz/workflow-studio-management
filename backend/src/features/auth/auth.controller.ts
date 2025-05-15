import {
  Request,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LocalAuthGuard } from './strategies/local/local-auth.guard';
import { JwtAuthGuard } from './strategies/jwt/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'Create new user' })
  signUp(@Body() body: SignUpDto) {
    return this.authService.signup(body);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Singin user to backend' })
  async signIn(@Request() req) {
    return this.authService.signin(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve user profile by token' })
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve 3rd party authenticated user' })
  getAuthUsers(@Request() req) {
    return this.authService.getAuthUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve 3rd party authenticated user' })
  getAuthUser(@Param('id') id: string) {
    return this.authService.getAuthUserById(+id);
  }
}
