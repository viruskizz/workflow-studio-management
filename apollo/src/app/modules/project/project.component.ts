import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/models/project.model';

@Component({
    templateUrl: './project.component.html',
    providers: [MessageService, ConfirmationService]
})
export class ProjectComponent implements OnInit {
    // Table config
    cols: any[] = [];
    statuses: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    // Data config
    projects: Project[] = [];
    project?: Project;
    projectDialog = false;
    deleteProjectDialog = false;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private projectService: ProjectService,
    ) { }

    ngOnInit() {
        this.projectService.listProject().subscribe({
            next: (v) => {
                console.log(v);
                this.projects = v;
            }
        })

        this.cols = [
            { field: 'id', header: 'ID' },
            { field: 'name', header: 'Name' },
            { field: 'status', header: 'Status' },
            { field: 'leader', header: 'Leader' },
        ];

        this.statuses = [
            { label: 'TODO', value: 'todo' },
            { label: 'DOING', value: 'doing' },
            { label: 'DONE', value: 'done' },
        ];
    }

    editProject(project: Project) {
        this.project = { ...project };
        console.log('Edit:', project);
        this.projectDialog = true;
    }

    createProject() {
        this.project = undefined;
        this.projectDialog = true;
    }

    deleteProject(project: Project) {
        this.deleteProjectDialog = true;
        this.project = { ...project };
    }

    confirmDelete() {
        // if (!this.project) {
        //     this.deleteProjectDialog = false
        //     return;
        // }
        // this.projectService.deleteproject(this.project!.id!).subscribe({
        //     next: (v) => {
        //         this.projects = this.projects.filter(u => u.id !== this.project!.id);
        //         this.deleteProjectDialog = false;
        //         this.project = undefined;
        //         this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pser Deleted', life: 3000 });
        //     }
        // })
    }

    hideDialog(event: any) {
        this.projectDialog = false;
        if (event && this.project?.id) {
            // Edited 
            this.projects[this.projects.findIndex(u => u.id === this.project!.id)] = event;
        } else if (event) {
            // Created project
            this.projects.push(event);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Project Created', life: 3000 });
        }
        this.project = undefined;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    getImage(url: string) {
        return url || 'assets/images/noimage.jpg';
    }
}
