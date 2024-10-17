import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrl: './member.component.css',
})
export class WorkMembmerComponent {
  @Input() name = 'John Doe';
  @Input() imageIconPath = '../assets/images/avatar-default.jpg';
}
