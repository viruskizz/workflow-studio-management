import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-td-leader-icon',
  templateUrl: './td-leader-icon.component.html',
  styleUrl: './td-leader-icon.component.css'
})
export class TdLeaderIconComponent {
  @Input() leaderIcon = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
}
