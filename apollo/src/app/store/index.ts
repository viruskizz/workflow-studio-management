import { ActionReducerMap } from "@ngrx/store";
import { ProjectEffects } from "./project/project.effects"
import { projectReducer, ProjectState } from "./project/project.reducer"

export interface AppState {
  project: ProjectState;
}

export const AppReducer: ActionReducerMap<AppState> = {
  project: projectReducer,
}

export const AppEffects = [
  ProjectEffects
]

// Re-exporting related actions and selectors
export * as ProjectActions from "./project/project.actions";
export * as ProjectSelectors from "./project/project.selectors";