import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TaskStatus } from 'src/app/models/task.model';
import { TeamStage } from 'src/app/models/team.model';
import { TeamService } from 'src/app/services/team.service';
import { AppStyleUtil } from 'src/app/utils/app-style.util';

@Component({
  selector: 'app-team-detail-stage',
  templateUrl: './team-detail-stage.component.html',
})
export class TeamDetailStageComponent implements OnInit {
  teamId?: number;
  stages: TeamStage[] = [];
  constructor(
    private teamService: TeamService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.teamId = 1;
    if (this.teamId) {
      this.teamService.listStages(this.teamId).subscribe({
        next: (v) => {
          this.stages = v;
        }
      })
    }
  }
  getTaskStatusStyle(status: TaskStatus) {
    return AppStyleUtil.getTaskStatusIcon(status)
  }

  remove(stage: TeamStage) {
    if (!this.teamId || !stage.id) { return; }
    this.confirmationService.confirm({
      key: 'removeTeamStage',
      message: 'Are you sure to remove',
      header: `${stage.taskStatus} - ${stage.name}`,
      accept: () => {
        this.teamService.removeStage(this.teamId!, stage.id!).subscribe({
          next: () => {
            this.stages = this.stages.filter(s => s.id !== stage.id);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: `${stage.name} has been removed`, key: 'teamDetailStage' });
          }
        })
      },
    })
  }
}
