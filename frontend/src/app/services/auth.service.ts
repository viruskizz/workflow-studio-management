import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  backendUrl = 'http://localhost:3000' + '/auth' 
  constructor(private httpClient: HttpClient, public jwtHelper: JwtHelperService) {}

  signIn(username: string, password: string) {
    const url = this.backendUrl + '/signin';
    return this.httpClient.post(url, {
      username,
      password
    })
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
}
