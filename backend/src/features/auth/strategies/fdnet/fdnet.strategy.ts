import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Strategy } from 'passport-local';
import { FdnetService } from '../../fdnet/fdnet.service';
import { catchError, from, lastValueFrom, map, of, switchMap } from 'rxjs';
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

  private async validateUser(username: string, pass: string): Promise<any> {
    return lastValueFrom(
      this.fdnetService.loginAD(username, pass).pipe(
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
          if (e.response && e.response.status === 401) {
            throw new UnauthorizedException('User or Password not correct');
          }
          throw new InternalServerErrorException(e.message);
        }),
      ),
    );
  }

  private async updateAuthToken(payload: FdnetAuthPayload) {
    const authUser = await this.authService.getAuthUser(payload.decoded.sub);
    if (authUser && DateTime.fromJSDate(authUser.expiredAt) > DateTime.now()) {
      console.log('Token is valid');
      return of(authUser);
    } else {
      const data = {
        username: payload.decoded.sub,
        provider: AuthProvider.FDNET,
        token: payload.token,
        refeshtoken: payload.refreshToken,
        expiredAt: DateTime.fromSeconds(payload.decoded.exp).toJSDate(),
        issueAt: DateTime.fromSeconds(payload.decoded.iat).toJSDate(),
      };
      return from(this.authService.saveAuth(data));
    }
  }
}
