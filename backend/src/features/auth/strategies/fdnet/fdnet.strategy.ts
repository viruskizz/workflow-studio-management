import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import * as argon2 from 'argon2';
import { UsersService } from '@backend/features/users/users.service';

@Injectable()
export class FdnetStrategy extends PassportStrategy(Strategy, 'fdnet') {
  constructor(private userService: UsersService) {
    super();
  }
  async validate(username: string, password: string): Promise<any> {
    console.log('ddd')
    throw new UnauthorizedException('FDet Testing Error');
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('User or Password not correct');
    }
    return user;
  }

  private async validateUser(username: string, pass: string): Promise<any> {
    // throw new UnauthorizedException('Testing Error');
    const user = await this.userService.getRepository().findOne({
      where: { username },
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
}
