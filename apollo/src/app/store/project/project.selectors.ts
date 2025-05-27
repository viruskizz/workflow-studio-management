import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ProjectState } from "./project.reducer";
import { Task, TaskTree } from "src/app/models/task.model";
import { TreeNode } from "primeng/api";
import { map } from "rxjs";

export const selectProjectFeature = createFeatureSelector<ProjectState>('project'); // 'project' should match your StoreModule key

export const selectProjectState = createSelector(
  selectProjectFeature,
  (state: ProjectState) => state.project
);

export const selectProjectId = createSelector(
  selectProjectFeature,
  (state: ProjectState) => state.projectId
);

export const selectProjectTaskState = createSelector(
  selectProjectFeature,
  (state: ProjectState) => state.tasks
);

export const selectProjectTaskTreeState = createSelector(
  selectProjectFeature,
  (state: ProjectState) => state.taskTree
);

export const selectProjectTaskTreeNodeState = createSelector(
  selectProjectFeature,
  (state: ProjectState) => {
    return state.taskTree ? mapTreesToNodes(state.taskTree) : [];
  }
);

function mapTreesToNodes(tasks: TaskTree[]): TreeNode<Task>[] {
  const nodes: TreeNode<Task>[] = [];
  tasks.forEach(task => {
    nodes.push({
      data: task,
      key: task.id.toString(),
      children: mapTreesToNodes(task.children)
    });
  });
  return nodes;
}