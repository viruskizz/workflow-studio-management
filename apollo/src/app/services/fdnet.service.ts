import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

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
}
