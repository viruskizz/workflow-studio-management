import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { map, Observable } from 'rxjs';

interface Breadcrumb {
  label: string;
  url?: string;
}

export const ProjectBreadcrumbResolver: ResolveFn<Breadcrumb[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  projectService: ProjectService = inject(ProjectService)
): Observable<Breadcrumb[]> | Breadcrumb[] => projectService.getProject(+route.paramMap.get('id')!)
  .pipe(
    map(v => {
      return [
        { label: 'Project', url: '/projects' },
        { label: v.name.toString(), url: v.id.toString() },
      ]
    })
  );