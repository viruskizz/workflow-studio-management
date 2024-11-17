import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private httpClient: HttpClient) { }

  private readonly baseUrl = `${environment.apiUrl}/projects/`;

  listProject() {
    return this.httpClient.get<Project[]>(this.baseUrl);
  }

  getProject(id: number) {
    const url = this.baseUrl + id;
    return this.httpClient.get<Project>(url);
  }

  create(body: Partial<Project>) {
    const url = this.baseUrl;
    return this.httpClient.post<Project>(url, body);
  }

  patch(id: number, body: Partial<Project>) {
    const url = this.baseUrl + id;
    return this.httpClient.patch<Project>(url, body);
  }
}
