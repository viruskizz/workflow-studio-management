export interface Team {
    id?: number;
    imageUrl?: string;
    name: string;
    key: string;
    description: string;
    leaderId: number;
    members: string[];
    projectActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}