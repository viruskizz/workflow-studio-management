import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from '@backend/features/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Auth, User } from '@backend/typeorm';
import { AuthProvider } from '@backend/typeorm/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private repository: Repository<Auth>,
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
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

  getAuthUsers() {
    return this.repository.find({
      where: {
        provider: AuthProvider.FDNET,
      },
    });
  }

  getAuthUser(username: string): Promise<Auth> {
    return this.repository.findOne({
      where: {
        username,
        provider: AuthProvider.FDNET,
      },
    });
  }

  saveAuth(data: Partial<Auth>) {
    return this.repository.save(data);
  }

  getAuthServer(): Promise<Auth> {
    return this.repository.findOne({
      where: {
        username: this.configService.get('FDNET_USERNAME'),
        provider: AuthProvider.FDNET_SERVER,
      },
    });
  }
}
