import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-member-icon',
  templateUrl: './member-icon.component.html',
  styleUrl: './member-icon.component.css',
})
export class MemberIconComponent {
  @Input() imgSrc = 'https://img.icons8.com/ios/452/saucer.png';
}
