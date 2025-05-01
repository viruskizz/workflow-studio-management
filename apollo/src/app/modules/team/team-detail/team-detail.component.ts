
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TeamService } from 'src/app/services/team.service';
import { TeamDetailInfoComponent } from './team-detail-info/team-detail-info.component';
import { TeamDetailMemberComponent } from './team-detail-member/team-detail-member.component';
import { forkJoin, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.component.html',
})
export class TeamDetailComponent implements OnInit {
  @ViewChild(TeamDetailInfoComponent) teamInfoComponent!: TeamDetailInfoComponent;
  @ViewChild(TeamDetailMemberComponent) teamMemberComponent!: TeamDetailMemberComponent;
  
  teamId!: number;
  loading = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private teamService: TeamService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.teamId = +params['id'];
    });
  }

  saveTeam() {
    this.loading = true;
    
    // First save the team info (name, leader)
    if (this.teamInfoComponent) {
      this.teamInfoComponent.onSave();
    }
    
    // Then save the team members
    if (this.teamMemberComponent) {
      this.teamMemberComponent.onSave();
    }
    
    this.loading = false;
  }

  deleteTeam() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this team?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        
        // First remove all team members
        this.teamService.getTeamMembers(this.teamId)
          .pipe(
            switchMap(members => {
              const removeRequests = members.map(member => 
                this.teamService.removeMemberFromTeam(this.teamId, member.id!)
                  .pipe(catchError(err => {
                    console.warn(`Failed to remove member ${member.id}`, err);
                    return of(null);
                  }))
              );
              return removeRequests.length ? forkJoin(removeRequests) : of([]);
            }),
            switchMap(() => this.teamService.deleteTeam(this.teamId))
          )
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Team deleted successfully'
              });
              this.router.navigate(['/teams']);
            },
            error: (error) => {
              console.error('Error deleting team:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete team. Please try again later.'
              });
              this.loading = false;
            },
            complete: () => {
              this.loading = false;
            }
          });
      }
    });
  }
}
