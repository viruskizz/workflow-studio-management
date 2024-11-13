import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './local-storage.service';
import { SignInResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  backendUrl = environment.apiUrl + '/auth'
  constructor(private httpClient: HttpClient, public jwtHelper: JwtHelperService) { }

  signIn(username: string, password: string) {
    const url = this.backendUrl + '/signin';
    return this.httpClient.post<SignInResponse>(url, {
      username,
      password
    })
  }

  public isAuthenticated(): boolean {
    const token = AuthService.tokenGetter();
    // Check whether the token is expired and return
    // true or false
    console.log('isTokenExpired:', this.jwtHelper.isTokenExpired(token));
    return !this.jwtHelper.isTokenExpired(token);
  }

  saveLogin(jwt: string) {
    const data = this.jwtHelper.decodeToken(jwt);
    console.log(data);
    LocalStorageService.save('accessToken', jwt);
    LocalStorageService.save('profile', data);
  }

  saveToken(jwt: any) {
    LocalStorageService.save('accessToken', jwt);
  }

  // for JwtModule
  static tokenGetter() {
    return LocalStorageService.get('accessToken');
  }

  static getProfile() {
    return LocalStorageService.get('profile');
  }
}
