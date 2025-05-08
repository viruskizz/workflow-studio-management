import { Project, Team, User } from '@backend/typeorm';

export interface TaskStats {
  todo: number;
  inProgress: number;
  done: number;
  total: number;
}

export interface UserTeam extends Team {
  members: User[];
}

export interface UserDashboard {
  user: User;
  taskStats: TaskStats;
  workingOn: Project[];
  workingWith: UserTeam[];
}
