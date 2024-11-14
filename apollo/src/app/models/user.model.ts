export interface User {
  id: number;
  password?: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  roles?: string[];
  role?: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}