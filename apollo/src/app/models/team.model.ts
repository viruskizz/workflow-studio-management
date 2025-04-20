import { TaskStatus } from './task.model';
import { User } from "./user.model";

export interface Team {
  id?: number;
  name: string;
  key?: string;
  description?: string;
  leaderId: number;
  leader?: User;
  members: User[];
  imageUrl?: string;
  projectActive?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamStage {
  id?: number;
  name: string;
  taskStatus: TaskStatus;
  order: number;
  teamId: number;
}