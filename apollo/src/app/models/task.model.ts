import { Project } from "./project.model";
import { Team, TeamStage } from "./team.model";
import { User } from "./user.model";

export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';

export type TaskType = 'EPIC' | 'STORY' | 'TASK' | 'SUBTASK';

export interface Task {
  id?: number;
  summary: string;
  description?: string;
  code: string;
  parentId?: number;
  projectId: number;
  project?: Project;
  teamId?: number;
  team?: Team;
  assigneeId?: number;
  assignee?: User;
  status: TaskStatus;
  type: TaskType;
  stageId?: number;
  stage?: TeamStage;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskTree extends Task {
  children: TaskTree[];
}

export interface TaskStats {
  todo: number;
  inProgress: number;
  done: number;
  total: number;
}