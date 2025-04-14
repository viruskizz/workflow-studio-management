import { Component, OnInit } from '@angular/core';
import { Team } from 'src/app/models/team.model';
import { User } from 'src/app/models/user.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { TeamService } from 'src/app/services/team.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './team.component.html',
  providers: [MessageService, ConfirmationService],
})
export class TeamComponent implements OnInit {
  teams: Team[] = [];
  selectedTeam?: Team;
  teamDialog = false;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private teamService: TeamService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTeams();
  }

  loadTeams() {
    this.teamService.listTeams().subscribe({
      next: (teams) => {
        this.teams = teams;
        this.loadTeamDetails();
      },
      error: (error) => console.error('Error loading teams:', error),
    });
  }

  loadTeamDetails() {
    this.teams.forEach((team) => {
      if (team.id) this.fetchTeamDetails(team.id);
    });
  }

  fetchTeamDetails(teamId: number) {
    this.teamService.getTeamWithMembers(teamId).subscribe({
      next: (teamWithDetails) => this.updateTeamDetails(teamWithDetails),
      error: (error) => console.error(`Error loading details for team ${teamId}:`, error),
    });
  }

  updateTeamDetails(teamWithDetails: Team) {
    const index = this.teams.findIndex((t) => t.id === teamWithDetails.id);
    if (index !== -1) {
      this.teams[index] = teamWithDetails;
      this.teams = [...this.teams];
    }
  }

  editTeam(team: Team) {
    this.selectedTeam = { ...team };
    this.teamDialog = true;
  }

  openNewTeamDialog() {
    this.selectedTeam = undefined;
    this.teamDialog = true;
  }

  deleteTeam(team: Team) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${team.name}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.performTeamDeletion(team),
    });
  }

  performTeamDeletion(team: Team) {
    this.teamService.deleteTeam(team.id!).subscribe({
      next: () => this.handleTeamDeletionSuccess(team),
      error: (error) => this.handleTeamDeletionError(error),
    });
  }

  handleTeamDeletionSuccess(team: Team) {
    this.teams = this.teams.filter((t) => t.id !== team.id);
    this.showSuccessMessage('Team Deleted');
  }

  handleTeamDeletionError(error: any) {
    console.error('Error deleting team:', error);
    this.showErrorMessage('Failed to delete team');
  }

  removeMember(team: Team, member: User) {
    this.confirmationService.confirm({
      message: `Are you sure you want to remove ${member.username} from ${team.name}?`,
      header: 'Confirm Member Removal',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.performMemberRemoval(team, member),
    });
  }

  performMemberRemoval(team: Team, member: User) {
    this.teamService.removeMemberFromTeam(team.id!, member.id!).subscribe({
      next: () => this.handleMemberRemovalSuccess(team, member),
      error: (error) => this.handleMemberRemovalError(error),
    });
  }

  handleMemberRemovalSuccess(team: Team, member: User) {
    team.members = team.members.filter(m => m.id !== member.id);
    this.showSuccessMessage('Member Removed');
  }

  handleMemberRemovalError(error: any) {
    console.error('Error removing member:', error);
    this.showErrorMessage('Failed to remove member');
  }

  onTeamSave(team: Team) {
    const index = this.teams.findIndex((t) => t.id === team.id);
    if (index > -1) {
      this.teams[index] = { ...team };
      this.fetchTeamDetails(team.id!);
    } else {
      this.teams.push(team);
      this.fetchTeamDetails(team.id!);
    }

    this.teams = [...this.teams];
    this.teamDialog = false;
    this.selectedTeam = undefined;
    this.showSuccessMessage(`Team ${team.id ? 'updated' : 'created'} successfully`);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getImage(url: string | undefined) {
    return url || 'assets/images/noimage.jpg';
  }

  onImageError(team: Team) {
    team.imageUrl = 'assets/images/noimage.jpg';
  }

  private showSuccessMessage(detail: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail,
      life: 3000,
    });
  }

  private showErrorMessage(detail: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail,
      life: 3000,
    });
  }

  navigateToTeamDetail(team: Team) {
    if (team && team.id) {
      this.router.navigate(['/teams', team.id]);
    }
  }
}

