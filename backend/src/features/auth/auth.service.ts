import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from '@backend/features/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@backend/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signin(user: any) {
    // Use LocalStrategy Guard to validate before signin
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
