import { Project } from "./project.model";
import { User } from "./user.model";

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type TaskType = 'EPIC' | 'STORY' | 'TASK' | 'SUBTASK';

export interface Task {
  id: number;
  summary: string;
  description?: string;
  code: string;
  parentId?: number;
  projectId: number;
  project?: Project;
  assigneeId?: number;
  assignee?: User;
  status: TaskStatus;
  type: TaskType;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskTree extends Task {
  children: TaskTree[];
}