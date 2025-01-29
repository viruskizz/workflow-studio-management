import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { TreeTable } from 'primeng/treetable';
import { NodeService } from 'src/app/demo/service/node.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
})
export class ProjectViewComponent {

  files2: TreeNode<any> | TreeNode<any>[] | any[] | any;
  cols: any[] = [];
  projectId?: number;

  constructor(
    private route: ActivatedRoute,
    private nodeService: NodeService,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    const params = this.route.snapshot.params;
    this.projectId = params['id'];
    this.nodeService.getFilesystem().then(files => this.files2 = files);
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'size', header: 'Size' },
      { field: 'type', header: 'Type' }
    ];
    this.projectService.listTaskTrees(this.projectId!).subscribe(
      res => {
        console.log('Tasks:', res);
      }
    )
  }

  onGlobalFilter(table: TreeTable, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
