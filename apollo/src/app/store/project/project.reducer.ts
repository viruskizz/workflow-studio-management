import { createReducer, on } from "@ngrx/store";
import { Task } from "src/app/models/task.model";
import { Project } from "src/app/models/project.model";
import { setTasks } from "./project.actions";

export interface TastState {
  projectId?: number;
  project: Project | undefined;
  tasks: Task[];
  tasking?: Partial<Task>;
}

export const initialState: TastState = {
  tasks: [],
  projectId: undefined,
  project: undefined,
  tasking: undefined,
}

export const projectReducer = createReducer(
  initialState,
  on(setTasks, (state, { tasks }) => ({
    ...state,
    tasks,
  })),
);