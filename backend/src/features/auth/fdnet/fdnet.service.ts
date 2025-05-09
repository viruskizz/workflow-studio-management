import { AuthProvider } from '@backend/typeorm/auth.entity';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { from, map, of, switchMap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { DateTime } from 'luxon';

@Injectable()
export class FdnetService {
  baseUrl = 'https://api.dhammakaya.network/api';

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  getHello() {
    return this.getServerToken();
  }

  signIn(fdnetUser: any) {
    console.log('fdnetUser:', fdnetUser);
    return fdnetUser;
    // return this.authService.signin(user)
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

  async getServerToken() {
    const authServer = await this.authService.getAuthServer();
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
