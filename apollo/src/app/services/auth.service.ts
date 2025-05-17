import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './local-storage.service';
import { AuthUser, SignInResponse } from '../models/auth.model';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  backendUrl = environment.apiUrl + '/auth'
  constructor(
    private httpClient: HttpClient,
    public jwtHelper: JwtHelperService,
    private router: Router,
    private userService: UserService) { }

  localSignIn(username: string, password: string) {
    const url = this.backendUrl + '/signin';
    return this.httpClient.post<SignInResponse>(url, {
      username,
      password
    })
  }

  // fdnetSignIn(username: string, password: string) {
  //   const url = this.backendUrl + '/fdnet/signin';
  //   return this.httpClient.post<SignInResponse>(url, {
  //     username,
  //     password
  //   })
  // }

  public isAuthenticated(): boolean {
    const token = AuthService.tokenGetter();
    // Check whether the token is expired and return
    // true or false
    console.log('isTokenExpired:', this.jwtHelper.isTokenExpired(token));
    return !this.jwtHelper.isTokenExpired(token);
  }

  saveLogin(jwt: string): Observable<User> {
    const data = this.jwtHelper.decodeToken(jwt);
    console.log('JWT decoded:', data);
    LocalStorageService.save('accessToken', jwt);
    LocalStorageService.save('user', data);
    return this.userService.getUser(data.sub).pipe(
      map((v: User) => {
        v.password = undefined;
        LocalStorageService.save('profile', v);
        return v;
      })
    )
  }

  signOut() {
    LocalStorageService.remove('accessToken');
    LocalStorageService.remove('user');
    LocalStorageService.remove('profile');
    this.router.navigate(['/auth/login'])
  }

  saveToken(jwt: any) {
    LocalStorageService.save('accessToken', jwt);
  }

  // for JwtModule
  static tokenGetter() {
    return LocalStorageService.get('accessToken');
  }

  static getUser(): AuthUser {
    return LocalStorageService.get('user');
  }

  static getProfile(): User {
    return LocalStorageService.get('profile');
  }
}
