export type Role = 'USER' | 'ADMIN' | 'MODERATOR';

export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  fullName?: string | null;
  isActive: boolean;
  roles: Role[];
  createdAt: string; // ou Date si tu gères en Date JS
  updatedAt: string; // idem
  jwt?: string | null; // si tu continues de gérer le token côté front
}

export interface Message {
  id: number;
  content: string;
  createdAt: string; // ou Date
  authorId: number;
  conversationId: number;
}

export interface Conversation {
  id: number;
  users: number[]; // array d'id des users
  messages: Message[];
}
