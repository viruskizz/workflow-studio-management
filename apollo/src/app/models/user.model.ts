import { Project } from "./project.model";
import { TaskStats } from "./task.model";
import { Team } from "./team.model";

export interface User {
  id?: number;
  password?: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  roles?: string[];
  role?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserDashboard {
  user: User;
  taskStats: TaskStats;
  workingOn: Project[];
  workingWith: Team[];
}