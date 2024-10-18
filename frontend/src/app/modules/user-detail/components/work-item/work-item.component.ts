import { Component, Input } from '@angular/core';

type Document = {
  name: string;
  lastModified: string;
}

@Component({
  selector: 'app-user-work-item',
  templateUrl: './work-item.component.html',
  styleUrl: './work-item.component.css',
})
export class WorkItemComponent {
  @Input() workDescription = "Work Description";
  @Input() document : Document = {
    name: 'document name',
    lastModified: '2024-12-12'
  };
}
