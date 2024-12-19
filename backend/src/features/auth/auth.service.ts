import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '@backend/features/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { User } from '@backend/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.getRepository().findOne({
      select: {
        id: true,
        username: true,
        password: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isMatch: boolean = await argon2.verify(user.password, pass);
    // console.log('isMatch', isMatch);
    if (!isMatch) {
      throw new UnauthorizedException('Password does not match');
    }
    const fullUser = await this.userService.findOne(user.id);
    return fullUser;
  }

  async signin(user: any) {
    return {
      access_token: this.jwtService.sign(this.userPayload(user)),
    };
  }

  async signup(user: any): Promise<any> {
    try {
      const newUser = await this.userService.create(user);
      return this.signin(newUser);
    } catch (e) {
      console.log(e);
      throw new HttpException(e, 1);
    }
  }

  private userPayload(user: User): any {
    return {
      username: user.username,
      sub: user.id,
    };
  }
}
