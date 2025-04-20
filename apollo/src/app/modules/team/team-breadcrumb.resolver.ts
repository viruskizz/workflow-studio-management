import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TeamService } from 'src/app/services/team.service';

interface Breadcrumb {
  label: string;
  url?: string;
}

export const TeamBreadcrumbResolver: ResolveFn<Breadcrumb[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  teamService: TeamService = inject(TeamService)
): Observable<Breadcrumb[]> | Breadcrumb[] => teamService.getTeam(+route.paramMap.get('id')!)
  .pipe(
    map(v => {
      const ext = [];
      if (route.url.length > 1) {
        ext.push({ label: route.url[1].path })
      }
      return [
        { label: 'Team', url: '/teams' },
        { label: v.name.toString(), url: `/teams/${v.id}` },
        ...ext,
      ]
    })
  );