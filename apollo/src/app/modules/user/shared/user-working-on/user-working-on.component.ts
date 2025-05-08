import { Component, Input } from '@angular/core';
import { Project } from 'src/app/models/project.model';

@Component({
  selector: 'app-user-working-on',
  templateUrl: './user-working-on.component.html'
})
export class UserWorkingOnComponent {
  @Input() styleClass = '';
  @Input() projects: Project[] = [];
}