import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { TreeNode } from 'primeng/api';
import { TreeTable } from 'primeng/treetable';
import { Task, TaskStatus, TaskTree, TaskType } from 'src/app/models/task.model';
import { ProjectService } from 'src/app/services/project.service';
import { AppState, ProjectSelectors, ProjectActions } from 'src/app/store';
import { AppStyleUtil } from 'src/app/utils/app-style.util';

@Component({
  selector: 'app-project-tree-table-view',
  templateUrl: './project-tree-table-view.component.html'
})
export class ProjectTreeTableViewComponent implements OnInit, OnChanges {

  files2: TreeNode<any> | TreeNode<any>[] | any[] | any;
  tasks: TreeNode<Task> | TreeNode<Task>[] | Task[] | any = [];
  cols: any[] = [];
  projectId?: number;

  @Input() tasking: Partial<Task> | undefined;
  @Output() taskingChange = new EventEmitter<Partial<Task>>();

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    const params = this.route.snapshot.params;
    this.projectId = params['id'];
    this.cols = [
      { field: 'summary', header: 'Summary' },
      { field: 'status', header: 'Status' },
      { field: 'assignee', header: 'Assignee' },
      { field: 'actions', header: '' },
    ];
    this.store.dispatch(ProjectActions.loadTasksTree({ projectId: this.projectId! }));
    this.store.select(ProjectSelectors.selectProjectTaskTreeNodeState).subscribe((taskTree) => {
      if (taskTree) {
        this.tasks = taskTree;
      }
    });
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tasking']?.currentValue) {
      this.tasking = changes['tasking']?.currentValue;
    }
  }

  onGlobalFilter(table: TreeTable, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onAddTask(task?: Partial<Task>) {
    if (task) {
      this.tasking = {
        parentId: task.id,
        type: task.type === 'EPIC' ? 'STORY' : task.type === 'STORY' ? 'TASK' : 'SUBTASK',
      }
    } else {
      this.tasking = {
        type: 'EPIC'
      };
    }
    this.taskingChange.emit(this.tasking)
  }

  onViewTask(task: Partial<Task>) {
    this.tasking = task;
    this.taskingChange.emit(this.tasking)
  }

  getTypeIcon(type: TaskType): string {
    const icon = {
      'EPIC': 'assets/icons/jira-issue/epic.png',
      'STORY': 'assets/icons/jira-issue/story.png',
      'TASK': 'assets/icons/jira-issue/task.png',
      'SUBTASK': 'assets/icons/jira-issue/subtask.png',
    };
    return icon[type];
  }

  getStatusIconLabel(status: TaskStatus) {
    return AppStyleUtil.getTaskStatusIcon(status);
  }
}
