import { Task } from "./task.model";
import { User } from "./user.model";

export interface ProjectMetadata {
  last: number;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  imageUrl: string;
  category: string;
  key: string;
  metadata: ProjectMetadata;
  leaderId: number;
  leader?: User;
  createdAt: string; 
  updatedAt: string;
}
export interface ProjectWithTasks extends Project {
  tasks?: Task[];
}