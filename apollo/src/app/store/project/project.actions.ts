import { createAction, props } from "@ngrx/store";
import { Task } from "src/app/models/task.model";

export const setId = createAction('[Project] Set ID', props<{ projectId: number }>());
export const describe = createAction('[Project] Describe', props<{ projectId: number }>());
export const loadTasks = createAction('[Project] Load Tasks', props<{ projectId: number }>());
export const setTasks = createAction('[Project] Set Tasks', props<{ tasks: Task[] }>());
export const loadTasksTree = createAction('[Project] Load Tasks Tree', props<{ projectId: number }>());
export const setTasksTree = createAction('[Project] Set Tasks Tree', props<{ taskTree: any[] }>());
export const reset = createAction('[TaProjectsk] Reset Tasks')