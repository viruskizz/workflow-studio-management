import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { TreeTable } from 'primeng/treetable';
import { Task, TaskTree } from 'src/app/models/task.model';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project-tree-table-view',
  templateUrl: './project-tree-table-view.component.html'
})
export class ProjectTreeTableViewComponent implements OnInit {

  files2: TreeNode<any> | TreeNode<any>[] | any[] | any;
  tasks: TreeNode<Task> | TreeNode<Task>[] | Task[] | any = [];
  cols: any[] = [];
  projectId?: number;

  @Input() tasking: Partial<Task> | undefined;
  @Output() taskingChange = new EventEmitter<Partial<Task>>();

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ){}

  ngOnInit() {
    const params = this.route.snapshot.params;
    this.projectId = params['id'];
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'summary', header: 'Summary' },
      { field: 'type', header: 'Type' },
      { field: 'status', header: 'Status' },
      { field: 'assignee', header: 'Assignee' },
    ];
    this.projectService.listTaskTrees(this.projectId!).subscribe(
      res => {
        console.log('Tasks:', res);
        this.tasks = this.mapTreesToNodes(res);
        console.log('TreeNodes:', this.tasks);
      }
    )
  }

  onGlobalFilter(table: TreeTable, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  private mapTreesToNodes(tasks: TaskTree[]): TreeNode<Task>[] {
    const nodes: TreeNode<Task>[] = [];
    tasks.forEach(task => {
      nodes.push({
        data: task,
        key: task.id.toString(),
        children: this.mapTreesToNodes(task.children)
      });
    });
    return nodes;
  }

  onAddTask(task: Partial<Task>) {
    this.tasking = task;
    this.taskingChange.emit(task)
  }
}
