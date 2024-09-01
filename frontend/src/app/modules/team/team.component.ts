import { Component, OnInit } from '@angular/core';
import { TeamRow } from '../../models/team.model';
import { TeamsService } from '../../services/teams.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
})
export class TeamComponent implements OnInit {
  teamRows : TeamRow[] = [];
  key = "KEY";
  description = "description";
  currentProject = "currentProject";

  isHover = false;
  isSVGhover = false;

  tableDataPadding = "px-4 py-4"

  //icons
  teemoIcon = "https://masteringruneterra.com/wp-content/plugins/deck-viewer/assets/images/champions/01PZ008.webp";
  leaderIcon = "https://64.media.tumblr.com/4af2b4026f724a749b27e4cbae3f914a/d2464c1d38422cb8-d8/s1280x1920/1873c68cbe57ab93ef97412adb1d715082e73bc6.jpg";

  teamName = "Delta Force 510"
  constructor(private TeamsService : TeamsService ) {}

  changeSVGColor() {
    console.log("hello world");
  }

  ngOnInit(): void {
    this.TeamsService.getTeam().subscribe((team) => {
      this.teamRows = team;
      console.log( this.teamRows );
    });
  }
    
}