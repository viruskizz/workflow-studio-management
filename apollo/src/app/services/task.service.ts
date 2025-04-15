import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly baseUrl = `${environment.apiUrl}/tasks`;

  constructor(private httpClient: HttpClient) { }

  list(filter?: Partial<Task>) {
    let params = new HttpParams();
    if (filter) {
      params = this._setParamsFromObject(params, filter, 'filter')
    }
    return this.httpClient.get(this.baseUrl, {
      params,
    });
  }

  create(body: Partial<Task>) {
    return this.httpClient.post(this.baseUrl, body)
  }

  update(body: Partial<Task>) {
    return this.httpClient.patch(this.baseUrl, {
      body,
    })
  }

  private _setParamsFromObject(param: HttpParams, params: object, name: string) {
    for (const [key, value] of Object.entries(params)) {
      param.set(`${name}[${key}]`,value);
    }
    return param;
  }

  // Wait for optimize
  getTasks(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(this.baseUrl);
  }

  getTask(id: number): Observable<Task> {
    return this.httpClient.get<Task>(`${this.baseUrl}/${id}`);
  }

  getUserTasks(userId: number): Observable<Task[]> {
    // Using query parameters to filter tasks by assignee
    const params = new HttpParams().set('filter', JSON.stringify({ assigneeId: userId }));
    return this.httpClient.get<Task[]>(this.baseUrl, { params });
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.httpClient.post<Task>(this.baseUrl, task);
  }

  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    return this.httpClient.patch<Task>(`${this.baseUrl}/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }
}
