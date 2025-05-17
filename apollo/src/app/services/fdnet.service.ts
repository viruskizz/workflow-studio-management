import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthSignUpResponse, SignInResponse } from '../models/auth.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FdnetService {

  backendUrl = environment.apiUrl + '/auth/fdnet'
  

  constructor(private httpClient: HttpClient) { }

  getUser(username: string) {
    const url = `${this.backendUrl}/users/${username}`;
    return this.httpClient.get(url);
  }

  signin(username: string, password: string) {
    const url = `${this.backendUrl}/signin`;
    return this.httpClient.post<SignInResponse>(url, {
      username,
      password
    })
  }

  signup(username: string) {
    const token = AuthService.tokenGetter();
    const url = `${this.backendUrl}/signup`;
    return this.httpClient.post<AuthSignUpResponse>(url, { username }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
