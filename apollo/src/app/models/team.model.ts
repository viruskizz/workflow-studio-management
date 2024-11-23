export interface Team {
    id?: number;
    name: string;
    key: string;
    description: string;
    leaderId: number;
    members: string[];
    projectActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}