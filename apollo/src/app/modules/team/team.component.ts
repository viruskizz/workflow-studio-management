import { Component, OnInit } from '@angular/core';
import { Team } from 'src/app/models/team.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { TeamService } from 'src/app/services/team.service';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  templateUrl: './team.component.html',
  providers: [MessageService, ConfirmationService]
})
export class TeamComponent implements OnInit {
  teams: Team[] = [];
  users: User[] = [];
  selectedTeam?: Team;
  teamDialog = false;
  deleteTeamDialog = false;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private teamService: TeamService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.loadTeams();
    this.loadUsers();
  }

  loadTeams() {
    this.teamService.listTeams().subscribe({
      next: (teams) => {
        this.teams = teams;
      },
      error: (error) => console.error('Error loading teams:', error)
    });
  }

  loadUsers() {
    this.userService.listUser().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => console.error('Error loading users:', error)
    });
  }

  getUser(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  openNewTeamDialog() {
    this.selectedTeam = undefined;
    this.teamDialog = true;
  }

  editTeam(team: Team) {
    this.selectedTeam = { ...team };
    this.teamDialog = true;
  }

  deleteTeam(team: Team) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${team.name}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.teamService.deleteTeam(team.id!).subscribe({
          next: () => {
            this.teams = this.teams.filter(t => t.id !== team.id);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Team Deleted', life: 3000 });
          },
          error: (error) => console.error('Error deleting team:', error)
        });
      }
    });
  }

  onTeamSave(team: Team) {
    const index = this.teams.findIndex(t => t.id === team.id);
    if (index > -1) {
      this.teams[index] = team;
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Team Updated', life: 3000 });
    } else {
      this.teams.push(team);
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Team Created', life: 3000 });
    }
    this.teamDialog = false;
    this.selectedTeam = undefined;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}

