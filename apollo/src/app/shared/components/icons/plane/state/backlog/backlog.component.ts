import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-plane-state-backlog',
  templateUrl: './backlog.component.html',
})
export class BacklogComponent {
  @Input() className?: string;
  @Input() width?: string = "20";
  @Input() height?: string = "20";
  @Input() color?: string = "#a3a3a3";
}
