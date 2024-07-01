import { TeamsService } from './teams.service';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
} from '@nestjs/common';
import { Observable, catchError, from, switchMap, throwError } from 'rxjs';

@Injectable()
export class TeamValidateInterceptor implements NestInterceptor {
  constructor(private teamService: TeamsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const pathPattern = /^\/teams\/\d+/;
    const { url } = context.switchToHttp().getRequest<Request>();
    if (url.match(pathPattern)) {
      const pathParams = url.substring('/teams/'.length).split('/');
      const id = pathParams[0];
      return from(this.teamService.findOne(+id)).pipe(
        switchMap((res) => {
          if (res) {
            return next.handle();
          } else {
            throw new NotFoundException('Team does not existed');
          }
        }),
        catchError((err) => throwError(() => err)),
      );
    }
    return next.handle();
  }
}
