import { AuthService } from './services/auth.service';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

export enum ROLE {
  'ADMIN' = 'admin',
  'SUPERUSER' = 'superuser',
  'MEMBER' = 'member',
}

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) { }

  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let url: string = state.url;
    return this.checkAccess(next, url)
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(next, state);
  }

  checkAccess(route: ActivatedRouteSnapshot, url: any) {
    const accessRoles: string[] = route.data['roles'];
    const authRedirect: string[] = route.data['authRedirect'] || '/';
    const isAuthenticated = this.authService.isAuthenticated();
    if (!isAuthenticated) {
      console.error('Uauthorized');
      this.router.navigate([authRedirect]);
      return false;
    }
    const profiles = AuthService.getUser();
    const roles = profiles.roles;
    if (accessRoles && roles && roles.some(r => accessRoles.findIndex(ar => ar === r) > -1)) {
      console.error('Forbidden');
      this.router.navigate([authRedirect]);
      return false;
    }
    return true;
  }
}