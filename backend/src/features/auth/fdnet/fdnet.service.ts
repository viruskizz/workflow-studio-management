import { AuthProvider } from '@backend/typeorm/auth.entity';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { firstValueFrom, from, map, Observable, of, switchMap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { DateTime } from 'luxon';
import { UsersService } from '@backend/features/users/users.service';
import { CreateUserDto } from '@backend/features/users/dto/create-user.dto';
import { FDNetUser } from './fdnet.model';
import { User } from '@backend/typeorm';

@Injectable()
export class FdnetService {
  baseUrl = 'https://api.dhammakaya.network/api';

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private userService: UsersService,
    private httpService: HttpService,
  ) {}

  getHello() {
    return this.getServerToken();
  }

  signIn(fdnetUser: any) {
    // console.log('signin-fdnetUser:', fdnetUser);
    return fdnetUser;
    // return this.authService.signin(user)
  }

  async signUp(username: string) {
    const fdnetUser = await firstValueFrom(this.getUserAD(username));
    if (!fdnetUser) {
      throw new BadRequestException('User does not existed in FDNet');
    }
    const userBody: CreateUserDto = {
      username: fdnetUser.Aduser,
      password: fdnetUser.Aduser, // Use username as password
      firstName: fdnetUser.Fullname.split(' ')[0],
      lastName: fdnetUser.Fullname.split(' ')[1],
      imageUrl: fdnetUser.Picture,
    };
    const user: User = (await this.userService.create(userBody)) as User;
    const authUser = await this.authService.saveAuth({
      username: fdnetUser.Aduser,
      provider: AuthProvider.FDNET,
      userId: user.id!,
    });
    return { authUser };
  }

  /**
   * API Service
   */
  // Login for App
  loginApp() {
    const url = `${this.baseUrl}/Login/LoginAPP`;
    const appUsername = this.configService.get('FDNET_USERNAME');
    const appPassword = this.configService.get('FDNET_PASSWORD');
    return this.httpService
      .post(url, {
        UserName: appUsername,
        Password: appPassword,
      })
      .pipe(map((res) => res.data));
  }

  // Login for client
  loginAD(username: string, password: string) {
    const url = `${this.baseUrl}/Login/LoginAD`;
    return this.httpService.post(url, {
      username,
      password,
      AppName: this.configService.get('FDNET_APP_NAME'),
    });
  }

  getUserAD(username: string): Observable<FDNetUser> {
    const url = `${this.baseUrl}/Person/GetPersonAD`;
    return this.getServerToken().pipe(
      switchMap((payload) => {
        return this.httpService.get(url, {
          params: {
            AdUser: username,
          },
          headers: {
            Authorization: `Bearer ${payload.token}`,
          },
        });
      }),
      map((res) => (res.data.Data.length > 0 ? res.data.Data[0] : undefined)),
    );
  }

  getServerToken() {
    return from(this.authService.getAuthServer()).pipe(
      switchMap((authServer) => {
        if (
          authServer &&
          DateTime.fromJSDate(authServer.expiredAt) > DateTime.now()
        ) {
          console.log('serverToken is valid');
          return of(authServer);
        } else {
          return this.loginApp().pipe(
            map((jwt) => ({
              token: jwt.Token,
              refreshToken: jwt.RefreshToken,
              decoded: jwtDecode(jwt.Token),
            })),
            switchMap((payload) => this.saveServerToken(payload)),
          );
        }
      }),
    );
  }

  private saveServerToken(payload) {
    const data = {
      username: this.configService.get('FDNET_USERNAME'),
      provider: AuthProvider.FDNET_SERVER,
      token: payload.token,
      refeshtoken: payload.refreshToken,
      expiredAt: DateTime.fromSeconds(payload.decoded.exp).toJSDate(),
      issueAt: DateTime.fromSeconds(payload.decoded.iat).toJSDate(),
    };
    return from(this.authService.saveAuth(data));
  }
}
