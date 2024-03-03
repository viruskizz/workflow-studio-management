import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '@backend/features/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersEntity } from '@backend/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isMatch: boolean = await argon2.verify(user.password, pass);
    console.log('isMatch', isMatch);
    if (!isMatch) {
      throw new UnauthorizedException('Password does not match');
    }
    const { password, ...result } = user;
    return result;
  }

  async signin(user: any) {
    return {
      access_token: this.jwtService.sign(this.userPayload(user)),
    };
  }

  async signup(user: any): Promise<any> {
    const existingUser = await this.userService.findByUsername(user.username);
    if (existingUser) {
      throw new BadRequestException('user already exists');
    }
    console.log(user);
    try {
      const hashedPassword = await argon2.hash(user.password);
      console.log(hashedPassword);
      const newUser: UsersEntity = { ...user, password: hashedPassword };
      const result = await this.userService.create(newUser);
      return this.signin(newUser);
    } catch (e) {
      console.log(e);
      throw new HttpException(e, 1);
    }
  }

  private userPayload(user: UsersEntity): any {
    return {
      username: user.username,
      sub: user.id,
    };
  }
}
