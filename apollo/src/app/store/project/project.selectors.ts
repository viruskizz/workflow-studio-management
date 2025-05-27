import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ProjectState } from "./project.reducer";

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
