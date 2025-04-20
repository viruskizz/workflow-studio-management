import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, forkJoin, of } from 'rxjs';
import { Team, TeamStage } from '../models/team.model';
import { User } from '../models/user.model';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private readonly baseUrl = `${environment.apiUrl}/teams`;

  constructor(private httpClient: HttpClient) {}

  listTeams(): Observable<Team[]> {
    return this.httpClient.get<Team[]>(this.baseUrl).pipe(
      switchMap(teams => {
        const teamsWithDetails = teams.map(team => 
          this.getTeamWithMembers(team.id!)
        );
        return forkJoin(teamsWithDetails);
      })
    );
  }

  getTeam(id: number): Observable<Team> {
    return this.httpClient.get<Team>(`${this.baseUrl}/${id}`);
  }

  getTeamMembers(id: number): Observable<User[]> {
    return this.httpClient.get<{user: User}[]>(`${this.baseUrl}/${id}/members`).pipe(
      map(members => members.map(member => member.user))
    );
  }

  deleteTeam(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  createTeam(team: Partial<Team>): Observable<Team> {
    return this.httpClient.post<Team>(this.baseUrl, team);
  }

  updateTeam(id: number, team: Partial<Team>): Observable<Team> {
    return this.httpClient.patch<Team>(`${this.baseUrl}/${id}`, team);
  }

  getTeamWithMembers(id: number): Observable<Team> {
    return this.getTeam(id).pipe(
      switchMap(team => 
        forkJoin({
          team: of(team),
          members: this.getTeamMembers(id)
        })
      ),
      map(({ team, members }) => ({ ...team, members }))
    );
  }

  addMemberToTeam(teamId: number, userId: number): Observable<unknown> {
    return this.httpClient.post(`${this.baseUrl}/${teamId}/members`, { userId });
  }

  removeMemberFromTeam(teamId: number, userId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${teamId}/members`, {
      body: { userId }
    });
  }
  // Stage
  listStages(id: number): Observable<TeamStage[]> {
    const url = `${this.baseUrl}/${id}/stages`
    return this.httpClient.get<TeamStage[]>(url);
  }
  reorderStages(id: number) {
    const url = `${this.baseUrl}/${id}/stages/reorder`
    return this.httpClient.patch<TeamStage[]>(url, {});
  }
  removeStage(teamId: number, id: number) {
    const url = `${this.baseUrl}/${teamId}/stages/${id}`;
    return this.httpClient.delete(url);
  }
}

