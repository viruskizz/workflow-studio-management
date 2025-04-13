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
    return this.httpClient.get<{user: User}[]>(`${this.baseUrl}/${id}/members`).pipe(
      map(members => members.map(member => member.user))
    );
  }

  deleteTeam(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  createTeam(team: Partial<Team>): Observable<Team> {
    return this.httpClient.post<Team>(this.baseUrl, team).pipe(
      switchMap(createdTeam => this.handleTeamCreation(createdTeam, team)),
      catchError(this.handleError('Error creating team'))
    );
  }

  updateTeam(id: number, team: Partial<Team>): Observable<Team> {
    return this.httpClient.patch<Team>(`${this.baseUrl}/${id}`, team).pipe(
      switchMap(updatedTeam => this.handleTeamUpdate(updatedTeam, team)),
      catchError(this.handleError('Error updating team'))
    );
  }

  private handleTeamCreation(createdTeam: Team, originalTeam: Partial<Team>): Observable<Team> {
    if (originalTeam.members && originalTeam.members.length > 0 && createdTeam.id !== undefined) {
      return this.updateTeamMembers(createdTeam.id, originalTeam.members);
    }
    return of(createdTeam);
  }

  private handleTeamUpdate(updatedTeam: Team, originalTeam: Partial<Team>): Observable<Team> {
    if (originalTeam.members && updatedTeam.id !== undefined) {
      return this.updateTeamMembers(updatedTeam.id, originalTeam.members);
    }
    return of(updatedTeam);
  }

  private updateTeamMembers(teamId: number, newMembers: User[]): Observable<Team> {
    return this.getTeamMembers(teamId).pipe(
      switchMap(currentMembers => this.performMemberUpdates(teamId, currentMembers, newMembers)),
      switchMap(() => this.getTeamWithMembers(teamId)),
      catchError(this.handleError('Error updating team members'))
    );
  }

  private performMemberUpdates(teamId: number, currentMembers: User[], newMembers: User[]): Observable<unknown> {
    const removeMemberRequests = this.createRemoveMemberRequests(teamId, currentMembers, newMembers);
    const addMemberRequests = this.createAddMemberRequests(teamId, currentMembers, newMembers);
    return forkJoin([...removeMemberRequests, ...addMemberRequests]);
  }

  private createRemoveMemberRequests(teamId: number, currentMembers: User[], newMembers: User[]): Observable<unknown>[] {
    return currentMembers.filter(currentMember => !newMembers.some(m => m.id === currentMember.id))
      .map(memberToRemove => {
        if (memberToRemove.id !== undefined) {
          return this.removeMemberFromTeam(teamId, memberToRemove.id);
        }
        return of(null);
      });
  }

  private createAddMemberRequests(teamId: number, currentMembers: User[], newMembers: User[]): Observable<unknown>[] {
    return newMembers
      .filter(member => !currentMembers.some(cm => cm.id === member.id))
      .map(memberToAdd => {
        if (memberToAdd.id !== undefined) {
          return this.addMemberToTeam(teamId, memberToAdd.id);
        }
        return of(null);
      });
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

  removeMemberFromTeam(teamId: number, userId: number): Observable<unknown> {
    return this.httpClient.delete(`${this.baseUrl}/${teamId}/members`, { body: { userId } });
  }

  private handleError(operation = 'operation') {
    return (error: unknown): Observable<never> => {
      console.error(`${operation}:`, error);
      throw error;
    };
  }
}

