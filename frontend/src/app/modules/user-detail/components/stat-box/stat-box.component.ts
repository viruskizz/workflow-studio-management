import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-stat-box',
  templateUrl: './stat-box.component.html',
  styleUrl: './stat-box.component.css',
})
export class StatBoxComponent {
  @Input() label = "ba";
  @Input() value = "12";
}
