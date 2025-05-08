import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

interface Breadcrumb {
  label: string;
  url?: string;
}

export const UserBreadcrumbResolver: ResolveFn<Breadcrumb[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  userService: UserService = inject(UserService)
): Observable<Breadcrumb[]> | Breadcrumb[] => {
  // Force resolver to run every time by adding a timestamp to the route data
  route.data = { ...route.data, timestamp: Date.now() };
  
  return userService.getUser(+route.paramMap.get('id')!)
    .pipe(
      map(user => {
        const ext = [];
        if (route.url.length > 1) {
          ext.push({ label: route.url[1].path });
        }
        return [
          { label: 'Users', url: '/users' },
          { label: `${user.firstName} ${user.lastName}`, url: `/users/${user.id}` },
          ...ext,
        ];
      })
    );
};