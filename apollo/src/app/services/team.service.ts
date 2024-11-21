import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Team } from '../models/team.model';

@Injectable({
    providedIn: 'root'
})
export class TeamService {
    private readonly baseUrl = `${environment.apiUrl}/teams/`;

    constructor(private httpClient: HttpClient) { }

    listTeams(): Observable<Team[]> {
        return this.httpClient.get<Team[]>(`${this.baseUrl}`);
    }

    deleteTeam(id: number): Observable<void> {
        return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
    }

    createTeam(team: Team): Observable<Team> {
        return this.httpClient.post<Team>(`${this.baseUrl}`, team);
    }

    updateTeam(id: number, team: Partial<Team>): Observable<Team> {
        return this.httpClient.put<Team>(`${this.baseUrl}/${id}`, team);
    }
}
