import { createReducer, on } from "@ngrx/store";
import { Task } from "src/app/models/task.model";
import { Project } from "src/app/models/project.model";
import { setId, setTasks, setTasksTree } from "./project.actions";

export interface ProjectState {
  projectId?: number;
  project: Project | undefined;
  tasks: Task[];
  tasking?: Partial<Task>;
  taskTree?: any[];
}

export const initialState: ProjectState = {
  projectId: undefined,
  project: undefined,
  tasking: undefined,
  tasks: [],
  taskTree: [],
}

export const projectReducer = createReducer(
  initialState,
  on(setId, (state, { projectId }) => ({
    ...state,
    projectId,
  })),
  on(setTasks, (state, { tasks }) => ({
    ...state,
    tasks,
  })),
  on(setTasksTree, (state, { taskTree }) => ({
    ...state,
    taskTree,
  }))
);