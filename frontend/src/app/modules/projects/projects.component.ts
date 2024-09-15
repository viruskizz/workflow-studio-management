import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';
import {
  TableHeader,
  DynamicTableComponent,
} from '../../shared/components/dynamic-table/dynamic-table.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
})
export class ProjectsComponent implements AfterViewInit {
  data: Project[] = [];
  tableHeader = "Project";
  rowCount = 0;
  projectsCount = 0;
  leaderIcon = "https://media-rockstargames-com.akamaized.net/rockstargames-newsite/img/global/downloads/buddyiconsconavatars/rdr2_tshirt_linocut_textured_256x256.jpg";

  @ViewChild('dyntable') table!: DynamicTableComponent;

  constructor(private projectService: ProjectService) {}

  ngAfterViewInit(): void {
    this.projectService.listProject().subscribe((projects) => {
      this.data = projects;
      this.projectsCount = this.data.length;

      const headers: TableHeader[] = [
        { key: 'NAME', index: 0, isSelected: true },
        { key: 'KEY', index: 1, isSelected: true },
        { key: 'DESCRIPTION', index: 2, isSelected: true },
        { key: 'STATUS', index: 3, isSelected: true },
        { key: 'LEAD', index: 4, isSelected: true },
        { key: 'CATEGORY', index: 5, isSelected: true },
        { key: 'MORE ACTIONS', index: 6, isSelected: true },
      ];

      this.table.render(headers);

      this.rowCount = this.data.length;
    });
  }

  get projectCount(): number {
    return this.data.length;
  }
}
