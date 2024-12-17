import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { forkJoin, map, Observable } from 'rxjs';
import { Team } from '../models/team.model';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root',
})
export class TeamService {
    private readonly baseUrl = `${environment.apiUrl}/teams`;

    constructor(private httpClient: HttpClient) {}

    listTeams(): Observable<Team[]> {
        return this.httpClient.get<Team[]>(this.baseUrl);
    }

    getTeamDetails(id: number): Observable<Team> {
        return this.httpClient.get<Team>(`${this.baseUrl}/${id}`);
    }

    getTeamMembers(id: number): Observable<User[]> {
        return this.httpClient
            .get<{ user: User }[]>(`${this.baseUrl}/${id}/members`)
            .pipe(map((members) => members.map((m) => m.user)));
    }

    createTeam(team: Partial<Team>): Observable<Team> {
        return this.httpClient.post<Team>(this.baseUrl, team);
    }

    updateTeam(id: number, team: Partial<Team>): Observable<Team> {
        return this.httpClient.put<Team>(`${this.baseUrl}/${id}`, team);
    }

    deleteTeam(id: number): Observable<void> {
        return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
    }

    getTeamWithMembers(id: number): Observable<Team> {
        return forkJoin([
            this.getTeamDetails(id),
            this.getTeamMembers(id),
        ]).pipe(
            map(([team, members]) => ({
                ...team,
                members,
                memberIds: members.map((m) => m.id!),
            }))
        );
    }
}
