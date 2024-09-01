import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { TeamMember } from '../models/team.model';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  constructor( private httpClient : HttpClient ) { }

  private readonly baseURL = `${environment.apiUrl}/teams`;

  getTeamMembers() {
    return this.httpClient.get<TeamMember[]>(this.baseURL);
  }
}
