import { Component, OnInit } from '@angular/core';
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
  constructor(private teamService: TeamService) {}

  ngOnInit() {
    this.teamId = 1;
    if (this.teamId) {
      this.teamService.listTeamStages(this.teamId).subscribe({
        next: (v) => {
          this.stages = v;
        }
      })
    }
  }
  getTaskStatusStyle(status: TaskStatus) {
    return AppStyleUtil.getTaskStatusIcon(status)
  }
}
