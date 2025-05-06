import { User } from '@backend/typeorm';

export interface TaskStats {
  todo: number;
  inProgress: number;
  done: number;
  total: number;
}

export interface WorkingOnProject {
  id: number;
  name: string;
  description: string;
  updatedAt: Date;
  status: string;
  imageUrl?: string;
}

export interface TeamInfo {
  id: number;
  name: string;
}

export interface WorkingWithUser extends User {
  teams: TeamInfo[];
}

export interface UserDashboard {
  user: User;
  taskStats: TaskStats;
  workingOn: WorkingOnProject[];
  workingWith: WorkingWithUser[];
}
