import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
} from '@nestjs/common';
import { Observable, catchError, from, switchMap, throwError } from 'rxjs';
import { ProjectsService } from './projects.service';

@Injectable()
export class ProjectValidateInterceptor implements NestInterceptor {
  constructor(private projectsService: ProjectsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const pathPattern = /^\/projects\/\d+/;
    const { url } = context.switchToHttp().getRequest<Request>();
    if (url.match(pathPattern)) {
      const pathParams = url.substring('/projects/'.length).split('/');
      const id = pathParams[0];
      console.log('pathParams:', pathParams);
      return from(this.projectsService.findOne(+id)).pipe(
        switchMap((res) => {
          if (res) {
            return next.handle();
          } else {
            throw new NotFoundException('Project does not existed');
          }
        }),
        catchError((err) => throwError(() => err)),
      );
    }
    return next.handle();
  }
}
