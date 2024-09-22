import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-header',
  templateUrl: './table-header.component.html',
  styleUrl: './table-header.component.css'
})
export class TableHeaderComponent {
  @Input() count = 5;
  @Input() tableHeader = "Empty";
}
