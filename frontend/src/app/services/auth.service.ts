import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  backendUrl = 'http://localhost:3000' + '/auth' 
  constructor(private httpClient: HttpClient) {}

  signIn(username: string, password: string) {
    const url = this.backendUrl + '/signin';
    return this.httpClient.post(url, {
      username,
      password
    })
  }
}
