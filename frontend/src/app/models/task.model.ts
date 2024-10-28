import { Project } from "./project.model";
import { User } from "./user.model";

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum TaskType {
  EPIC = 'EPIC',
  STORY = 'STORY',
  TASK = 'TASK',
  SUB_TASK = 'SUB_TASK',
}

export interface Task {
  id: number;
  summary: string;
  description?: string;
  code: string;
  type: TaskType;
  status: TaskStatus;
  projectId?: number;
  project: Project;
  assigneeId?: number;
  assignee?: User;
  parent?: Task;
  children?: Task[];
  createdAt: Date;
  updatedAt: Date;
}