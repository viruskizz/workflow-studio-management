import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { UserDashboard } from '../models/user.model';
import { Project } from '../models/project.model';
import { TaskStats } from '../models/task.model';
import { Team } from '../models/team.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly baseUrl = `${environment.apiUrl}/users`;

  constructor(private httpClient: HttpClient) { }

  getUserDashboard(userId: number): Observable<UserDashboard> {
    return this.httpClient.get<UserDashboard>(`${this.baseUrl}/${userId}/dashboard`);
  }

  getTaskStats(userId: number): Observable<TaskStats> {
    return this.httpClient.get<TaskStats>(`${this.baseUrl}/${userId}/dashboard/stats`);
  }

  getWorkingOn(userId: number): Observable<Project[]> {
    return this.httpClient.get<Project[]>(`${this.baseUrl}/${userId}/dashboard/workingOn`);
  }

  getWorkingWith(userId: number): Observable<Team[]> {
    return this.httpClient.get<Team[]>(`${this.baseUrl}/${userId}/dashboard/workingWith`);
  }
}

