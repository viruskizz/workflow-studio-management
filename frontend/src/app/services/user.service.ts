import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { User } from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  private readonly baseUrl = `${environment.apiUrl}/users/`;

  listUser() {
    return this.httpClient.get<User[]>(this.baseUrl);
  }

  getUser(id: number) {
    const url = this.baseUrl + id;
    return this.httpClient.get<User>(url);
  }
}