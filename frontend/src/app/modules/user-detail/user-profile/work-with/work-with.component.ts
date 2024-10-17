import { Component } from '@angular/core';

@Component({
  selector: 'app-work-with',
  templateUrl: './work-with.component.html',
  styleUrl: './work-with.component.css'
})
export class WorkWithComponent {
  members = Array.from({ length: 10 }, () => {
    return {
      imageIconPath: '../assets/images/avatar-default.jpg',
      name: 'Mok Maard',
      };
    })
}
