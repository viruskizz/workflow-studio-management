import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-team-td',
  templateUrl: './team-td.component.html',
  styleUrl: './team-td.component.css'
})
export class TeamTdComponent {
@Input() teamIcon = "https://masteringruneterra.com/wp-content/plugins/deck-viewer/assets/images/champions/01PZ008.webp";
@Input() teamName = "Delta Force 510";

}
