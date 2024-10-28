import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly baseUrl = `${environment.apiUrl}/tasks/`;

  constructor(private httpClient: HttpClient) { }

  list() {
    return this.httpClient.get<Task[]>(this.baseUrl)
  }
}
