import { Component } from '@angular/core';

@Component({
  selector: 'app-user-work-on',
  templateUrl: './work-on.component.html',
  styleUrl: './work-on.component.css',
})
export class WorkOnComponent {
  documents = Array.from({ length: 10 }, () => {
    return {
      name: "Document Name",
      lastModified: "2021-01-01",
    }
  })
}
