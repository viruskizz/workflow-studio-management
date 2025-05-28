import { createReducer, on } from "@ngrx/store";
import { Task } from "src/app/models/task.model";
import { Project } from "src/app/models/project.model";
import { setId, setTasks, setTasksTree } from "./project.actions";

export interface ProjectState {
  loading: boolean;
  error: string | null;
  projectId?: number;
  project: Project | undefined;
  tasks: Task[];
  tasking?: Partial<Task>;
  taskTree?: any[];
}

export const initialState: ProjectState = {
  loading: false,
  error: null,
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
    loading: false,
    error: null,
    projectId,
  })),
  on(setTasks, (state, { tasks }) => ({
    ...state,
    loading: false,
    error: null,
    tasks,
  })),
  on(setTasksTree, (state, { taskTree }) => ({
    ...state,
    loading: false,
    error: null,
    taskTree,
  }))
);