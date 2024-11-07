import { Component, OnInit, ViewChild } from '@angular/core';
import { TeamsService } from '../../services/teams.service';
import { TeamRow } from '../../models/team.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
})
export class TeamComponent implements OnInit {
  tableHeader = 'Teams';
  displayedColumns: string[] = ['name', 'key', 'description', 'lead', 'members', 'currentProject', 'actions'];
  dataSource = new MatTableDataSource<TeamRow>([]);
  @ViewChild(MatSort) sort!: MatSort;

  teamLogo = 'https://masteringruneterra.com/wp-content/plugins/deck-viewer/assets/images/champions/01PZ008.webp';
  leaderPic = 'https://64.media.tumblr.com/4af2b4026f724a749b27e4cbae3f914a/d2464c1d38422cb8-d8/s1280x1920/1873c68cbe57ab93ef97412adb1d715082e73bc6.jpg';
  memberPic = 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp';

  constructor(private teamsService: TeamsService, private router: Router) {}

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    // this.teamsService.getTeam().subscribe((teams) => {
    //   this.dataSource.data = teams;
    // });

    // For the dummy data
    this.dataSource.data = this.getDummyData();
  }

  getDummyData(): TeamRow[] {
    return Array.from({ length: 4 }, () => ({
      teamLogo: this.teamLogo,
      teamName: 'Delta Force 510',
      key: 'KEY',
      description: 'description',
      leaderPic: this.leaderPic,
      memberPics: Array.from({ length: 14 }, () => this.memberPic),
      currentProject: 'Current Project',
      projectName: "A1"
    }));
  }

  toView(team: TeamRow): void {
    // navigation to team details page
    this.router.navigate(['teams', team.key]);
  }
}