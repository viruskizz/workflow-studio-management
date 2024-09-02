import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  tableDataPadding = 'px-4 py-4';

  constructor(private userService: ProjectService) {}

  ngOnInit(): void {
    this.userService.listProject().subscribe((projects) => {
      this.projects = projects;
    });
  }

  get projectCount(): number {
    return this.projects.length;
  }
}
