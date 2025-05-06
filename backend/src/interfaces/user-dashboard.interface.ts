import { Project, User } from '@backend/typeorm';

export interface TaskStats {
  todo: number;
  inProgress: number;
  done: number;
  total: number;
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
  workingOn: Project[];
  workingWith: WorkingWithUser[];
}
