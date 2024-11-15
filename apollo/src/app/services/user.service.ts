import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) { }

  private readonly baseUrl = `${environment.apiUrl}/users/`;

  listUser() {
    return this.httpClient.get<User[]>(this.baseUrl);
  }

  getUser(id: number) {
    const url = this.baseUrl + id;
    return this.httpClient.get<User>(url);
  }

  createUser(body: Partial<User>) {
    return this.httpClient.post<User>(this.baseUrl, body);
  }

  patchUser(id: number, body: Partial<User>) {
    const url = this.baseUrl + id;
    return this.httpClient.patch(url, body, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
