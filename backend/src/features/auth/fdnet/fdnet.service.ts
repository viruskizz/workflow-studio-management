import { Auth, AuthProvider } from '@backend/typeorm/auth.entity';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import {
  catchError,
  combineLatest,
  firstValueFrom,
  from,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { DateTime } from 'luxon';
import { UsersService } from '@backend/features/users/users.service';
import { CreateUserDto } from '@backend/features/users/dto/create-user.dto';
import { FDNetUser } from './fdnet.model';
import { User } from '@backend/typeorm';
import { In } from 'typeorm';

@Injectable()
export class FdnetService {
  baseUrl = 'https://api.dhammakaya.network/api';

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    private httpService: HttpService,
  ) {}

  getHello() {
    return this.getServerToken();
  }

  getUser(username: string) {
    return this.getUserAD(username);
  }

  signIn(fdnetUser: any) {
    return from(this.userService.findOne(fdnetUser.userId)).pipe(
      switchMap((user) => {
        if (!user) {
          throw new BadRequestException('User does not existed');
        }
        return this.authService.signin(user);
      }),
    );
  }

  linkUser(username: string, userId: number) {
    return combineLatest([
      this.getUserAD(username),
      from(this.authService.getAuthUserByUsername(username)),
      from(this.userService.findOne(userId)),
    ]).pipe(
      switchMap(([fdnetUser, authUser, user]) => {
        if (!fdnetUser) {
          throw new BadRequestException('FDNet User does not existed');
        }
        if (!user) {
          throw new BadRequestException('Local User does not existed');
        }
        const fdAuthUser = authUser.find(
          (auth) => auth.provider === AuthProvider.FDNET,
        );
        if (fdAuthUser) {
          // Check if the user is already linked
          if (username !== fdAuthUser.username) {
            throw new BadRequestException(
              'Username is already linked to another user',
            );
          } else {
            return of(fdAuthUser);
          }
        }
        console.log('Linking user', fdAuthUser);
        const data: Partial<Auth> = {
          username: fdnetUser.Aduser,
          provider: AuthProvider.FDNET,
          userId: user.id!,
        };
        return from(this.authService.saveAuth(data));
      }),
    );
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
    return { user, authUser };
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
      switchMap((authServer) => {
        return this.httpService.get(url, {
          params: {
            AdUser: username,
          },
          headers: {
            Authorization: `Bearer ${authServer.token}`,
          },
        });
      }),
      map((res) => (res.data.Data.length > 0 ? res.data.Data[0] : undefined)),
      catchError((err) => {
        console.log('getUserAD error', err);
        throw new InternalServerErrorException(err);
      }),
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
            switchMap((payload) => {
              const { token, refreshToken, decoded } = payload;
              if (!authServer) {
                authServer = new Auth();
                authServer.username = this.configService.get('FDNET_USERNAME');
                authServer.provider = AuthProvider.FDNET_SERVER;
              }
              authServer.token = token;
              authServer.refeshtoken = refreshToken;
              authServer.expiredAt = DateTime.fromSeconds(
                decoded.exp,
              ).toJSDate();
              authServer.issueAt = DateTime.fromSeconds(decoded.iat).toJSDate();
              return from(this.authService.saveAuth(authServer));
            }),
          );
        }
      }),
    );
  }
}
