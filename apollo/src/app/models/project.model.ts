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
  createdAt: string; 
  updatedAt: string;
}
