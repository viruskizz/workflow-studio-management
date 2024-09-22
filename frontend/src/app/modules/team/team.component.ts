import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { TeamRow } from '../../models/team.model';
import { TeamsService } from '../../services/teams.service';
import { DynamicTableComponent, TableHeader } from '../../shared/components/dynamic-table/dynamic-table.component';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
})
export class TeamComponent implements AfterViewInit {
  tableHeader = 'Teams';
  rowCount = 0;

  teamRows: TeamRow[] = [];

  @ViewChild('dyntable') table!: DynamicTableComponent;

  key = 'KEY';
  description = 'description';
  currentProject = 'currentProject';
  //icons
  teamIcon =
    'https://masteringruneterra.com/wp-content/plugins/deck-viewer/assets/images/champions/01PZ008.webp';
  leaderIcon =
    'https://64.media.tumblr.com/4af2b4026f724a749b27e4cbae3f914a/d2464c1d38422cb8-d8/s1280x1920/1873c68cbe57ab93ef97412adb1d715082e73bc6.jpg';
  memberIcon =
    'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp';

  teamName = 'Delta Force 510';

  datas = Array.from({length : 4}, () => {
    return {
      teamIcon: this.teamIcon,
      teamName: this.teamName,
      key: this.key,
      description: this.description,
      leaderIcon: this.leaderIcon,
      membersIcon: Array.from({ length: 14 }, () => this.memberIcon),
      currentProject: this.currentProject,
    };
  });

  constructor(private TeamsService: TeamsService) {}

  ngAfterViewInit(): void {
    const headers: TableHeader[] = [
      { key: 'NAME', index: 0, isSelected: true },
      { key: 'KEY', index: 1, isSelected: true },
      { key: 'DESCRIPTION', index: 2, isSelected: true },
      { key: 'LEAD', index: 3, isSelected: true },
      { key: 'MEMBERS', index: 4, isSelected: true },
      { key: 'PROJECT ACTIVE', index: 5, isSelected: true },
      { key: 'MORE ACTIONS', index: 6, isSelected: true },
    ];

    this.table.render(headers);

    this.rowCount = this.datas.length;
  }

  // ngOnInit(): void {
  //   this.TeamsService.getTeam().subscribe((team) => {
  //     this.teamRows = team;
  //     console.log( this.teamRows );
  //   });
  // }
}
