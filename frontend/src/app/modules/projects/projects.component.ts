import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  styleUrl: './projects.component.css',
  templateUrl: './projects.component.html',
})
export class ProjectsComponent implements OnInit {
  tableHeader = "Project";
  displayedColumns: string[] = ['id', 'key', 'name', 'description', 'status', 'leader', 'actions'];
  dataSource = new MatTableDataSource<Project>([]);
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private projectService: ProjectService, private router: Router) {}

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.projectService.listProject().subscribe((projects) => {
      this.dataSource.data = projects;
    })
  }

  toView(project: Project) {
    this.router.navigate(['projects', project.id,])
  }
}
