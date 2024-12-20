import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, forkJoin, of } from 'rxjs';
import { Team } from '../models/team.model';
import { User } from '../models/user.model';
import { switchMap, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private readonly baseUrl = `${environment.apiUrl}/teams`;

  constructor(private httpClient: HttpClient) {}

  listTeams(): Observable<Team[]> {
    return this.httpClient.get<Team[]>(this.baseUrl);
  }

  getTeam(id: number): Observable<Team> {
    return this.httpClient.get<Team>(`${this.baseUrl}/${id}`);
  }

  getTeamMembers(id: number): Observable<User[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/${id}/members`).pipe(
      map(members => members.map(member => member.user))
    );
  }

  deleteTeam(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  createTeam(team: Partial<Team>): Observable<Team> {
    return this.httpClient.post<Team>(this.baseUrl, team).pipe(
      switchMap(createdTeam => {
        if (team.members && team.members.length > 0) {
          return this.updateTeamMembers(createdTeam.id!, team.members);
        }
        return of(createdTeam);
      }),
      catchError(error => {
        console.error('Error creating team:', error);
        throw error;
      })
    );
  }

  updateTeam(id: number, team: Partial<Team>): Observable<Team> {
    return this.httpClient.patch<Team>(`${this.baseUrl}/${id}`, team).pipe(
      switchMap(updatedTeam => {
        if (team.members) {
          return this.updateTeamMembers(updatedTeam.id!, team.members);
        }
        return of(updatedTeam);
      }),
      catchError(error => {
        console.error('Error updating team:', error);
        throw error;
      })
    );
  }

  private updateTeamMembers(teamId: number, newMembers: User[]): Observable<Team> {
    return this.getTeamMembers(teamId).pipe(
      switchMap(currentMembers => {
        const removeMemberRequests = currentMembers
          .filter(currentMember => !newMembers.some(m => m.id === currentMember.id))
          .map(memberToRemove => this.httpClient.delete(`${this.baseUrl}/${teamId}/members/${memberToRemove.id}`));

        const addMemberRequests = newMembers
          .filter(member => !currentMembers.some(cm => cm.id === member.id))
          .map(memberToAdd => this.httpClient.post(`${this.baseUrl}/${teamId}/members`, { userId: memberToAdd.id }));

        return forkJoin([...removeMemberRequests, ...addMemberRequests]);
      }),
      switchMap(() => this.getTeamWithMembers(teamId)),
      catchError(error => {
        console.error('Error updating team members:', error);
        throw error;
      })
    );
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
}

