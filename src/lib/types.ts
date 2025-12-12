import { FieldValue } from 'firebase/firestore';

export type Workspace = {
    id: string;
    name: string;
    icon?: string;
    color: string;
};

export type AiInsights = {
    summary?: string;
    keyInsights?: string[];
    actionItems?: string[];
    suggestedTags?: string[];
    lastProcessed?: string;
}

export type Note = {
    id: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: string | FieldValue;
    updatedAt: string | FieldValue;
    workspaceId: string;
    aiInsights: AiInsights;
};

export type User = {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
};
