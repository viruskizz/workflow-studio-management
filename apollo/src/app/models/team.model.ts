import { User } from "./user.model";

export interface Team {
    id?: number;
    imageUrl?: string;
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

