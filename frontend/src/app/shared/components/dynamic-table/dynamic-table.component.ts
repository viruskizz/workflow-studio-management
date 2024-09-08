import { Component, Input, OnInit } from '@angular/core';

export interface TableHeader {
  key: string;
  index: number;
  isSelected: boolean;
}

export interface DynamicTable {
  headers: TableHeader[];
  data: any[];
}

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css'],
})
export class DynamicTableComponent implements OnInit {
  @Input() tableData: DynamicTable = { headers: [], data: [] };
  allHeader: TableHeader[] = [];

  ngOnInit() {
    this.tableData = { headers: [], data: [] };
  }

  render(headers: TableHeader[], data: any[]) {
    this.tableData = {
      headers: headers.filter((x) => x.isSelected),
      data: data,
    };
    this.allHeader = headers;
  }
}
