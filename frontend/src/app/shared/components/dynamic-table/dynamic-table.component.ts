import { Component, Input, OnInit } from '@angular/core';

export interface TableHeader {
  key: string;
  index: number;
  isSelected: boolean;
}

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css'],
})
export class DynamicTableComponent implements OnInit {
  @Input() headers: TableHeader[] = [];

  ngOnInit() {
    this.headers = [];
  }

  render(headers: TableHeader[]) {
    this.headers = headers;
  }
}
