import { Component, OnInit } from '@angular/core';
import { Team } from 'src/app/models/team.model';
import { User } from 'src/app/models/user.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { TeamService } from 'src/app/services/team.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  templateUrl: './team.component.html',
  providers: [MessageService, ConfirmationService],
})
export class TeamComponent implements OnInit {
  teams: Team[] = [];
  selectedTeam?: Team;
  teamDialog = false;
  loading = false;

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
    this.loading = true;
    this.teamService.listTeams()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          this.teams = data;
        },
        error: (error) => {
          console.error('Error loading teams:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load teams',
            life: 3000
          });
        }
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
    this.loading = true;
    
    // First check if the team has members
    if (team.members && team.members.length > 0) {
      // Remove all members first
      const removeMemberRequests = team.members.map(member => 
        this.teamService.removeMemberFromTeam(team.id!, member.id!)
      );
      
      // After all members are removed, delete the team
      forkJoin(removeMemberRequests)
        .pipe(
          switchMap(() => this.teamService.deleteTeam(team.id!)),
          finalize(() => this.loading = false)
        )
        .subscribe({
          next: () => {
            this.teams = this.teams.filter(t => t.id !== team.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Team deleted successfully',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Error deleting team:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete team. Please try again later.',
              life: 3000
            });
          }
        });
    } else {
      // If no members, directly delete the team
      this.teamService.deleteTeam(team.id!)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: () => {
            this.teams = this.teams.filter(t => t.id !== team.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Team deleted successfully',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Error deleting team:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete team. Please try again later.',
              life: 3000
            });
          }
        });
    }
  }

  navigateToTeamDetail(team: Team) {
    this.router.navigate(['/teams', team.id]);
  }

  onTeamSave(team: Team) {
    if (team.id) {
      // For existing team, find and update in the array
      const index = this.teams.findIndex(t => t.id === team.id);
      if (index !== -1) {
        this.teams[index] = team;
        this.teams = [...this.teams]; // Trigger change detection
      } else {
        // If not found, add to array
        this.teams.push(team);
        this.teams = [...this.teams];
      }
    } else {
      // For new team, add to array
      this.teams.push(team);
      this.teams = [...this.teams];
    }
    this.teamDialog = false;
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

  removeMember(team: Team, member: User) {
    this.confirmationService.confirm({
      message: `Are you sure you want to remove ${member.username} from ${team.name}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        this.teamService.removeMemberFromTeam(team.id!, member.id!)
          .pipe(finalize(() => this.loading = false))
          .subscribe({
            next: () => {
              team.members = team.members.filter(m => m.id !== member.id);
              this.teams = [...this.teams];
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Member removed successfully',
                life: 3000
              });
            },
            error: (error) => {
              console.error('Error removing member:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to remove member',
                life: 3000
              });
            }
          });
      }
    });
  }

  addMember(team: Team, userId: number) {
    this.loading = true;
    this.teamService.addMemberToTeam(team.id!, userId)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          // Refresh team data to get updated members list
          this.teamService.getTeamWithMembers(team.id!)
            .subscribe({
              next: (updatedTeam) => {
                this.updateTeamDetails(updatedTeam);
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Member added successfully',
                  life: 3000
                });
              }
            });
        },
        error: (error) => {
          console.error('Error adding member:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add member to team',
            life: 3000
          });
        }
      });
  }
}
