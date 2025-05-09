import { PassportStrategy } from '@nestjs/passport';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Strategy } from 'passport-local';
import { FdnetService } from '../../fdnet/fdnet.service';
import {
  catchError,
  from,
  lastValueFrom,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Auth } from '@backend/typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthProvider } from '@backend/typeorm/auth.entity';
import { DateTime } from 'luxon';
import { AuthService } from '../../auth.service';

interface FdnetAuthPayload {
  token: string;
  refreshToken: string;
  decoded: JwtPayload;
}
@Injectable()
export class FdnetStrategy extends PassportStrategy(Strategy, 'fdnet') {
  constructor(
    private authService: AuthService,
    private fdnetService: FdnetService,
    @InjectRepository(Auth)
    private repository: Repository<Auth>,
  ) {
    super();
  }
  async validate(username: string, password: string): Promise<any> {
    return this.validateUser(username, password);
  }

  private validateUser(username: string, pass: string): Observable<Auth> {
    return this.fdnetService.loginAD(username, pass).pipe(
      map((jwt) => {
        const decoded = jwtDecode(jwt.data.Token);
        const authPayload: FdnetAuthPayload = {
          token: jwt.data.Token,
          refreshToken: jwt.data.RefreshToken,
          decoded,
        };
        return authPayload;
      }),
      switchMap((authPayload) => this.updateAuthToken(authPayload)),
      catchError((e) => {
        console.log('Error:', e);
        if (e.response && e.response.status === 403) {
          throw new ForbiddenException('User not created');
        }
        if (e.response && e.response.status === 401) {
          throw new UnauthorizedException('User or Password not correct');
        }
        throw new InternalServerErrorException(e.message);
      }),
    );
  }

  private updateAuthToken(payload: FdnetAuthPayload): Observable<Auth> {
    // const authUser = await this.authService.getAuthUser(payload.decoded.sub);
    console.log('Update AuthToken');
    return from(this.authService.getAuthUser(payload.decoded.sub)).pipe(
      switchMap((authUser) => {
        if (!authUser) {
          throw new ForbiddenException('User not created');
        }
        if (DateTime.fromJSDate(authUser.expiredAt) > DateTime.now()) {
          return of(authUser);
        } else {
          const { exp, iat } = payload.decoded;
          authUser.token = payload.token;
          authUser.refeshtoken = payload.refreshToken;
          authUser.expiredAt = DateTime.fromSeconds(exp).toJSDate();
          authUser.issueAt = DateTime.fromSeconds(iat).toJSDate();
          return from(this.authService.saveAuth(authUser));
        }
      }),
    );
  }
}
