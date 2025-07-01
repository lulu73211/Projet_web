export type Role = 'USER' | 'ADMIN' | 'MODERATOR';

export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  firstName?: string | null;
  lastName?: string | null;
  isActive: boolean;
  roles: Role[];
  createdAt: string; // ou Date si tu restes côté Node
  updatedAt: string;
  conversations?: Conversation[]; // optionnel si non inclus
  messages?: Message[];
  jwt?: string | null; // pour ton front après login
}

export interface Conversation {
  id: number;
  users: User[]; // relation directe
  messages: Message[];
}

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  authorId: number;
  conversationId: number;
  author?: User;           // optionnel si tu inclues l'auteur
  conversation?: Conversation;
}
