import { User } from "./user.model";

export interface Team {
    id?: number;
    name: string;
    leaderId: number;
    members: User[];
    createdAt?: string;
    updatedAt?: string;
}