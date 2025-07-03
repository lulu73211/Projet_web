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
  createdAt: string;
  updatedAt: string;
  conversations?: Conversation[];
  messages?: Message[];
  jwt?: string | null; 
}

export interface Conversation {
  id: number;
  users: User[];
  messages: Message[];
}

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  authorId: number;
  conversationId: number;
  author?: User;
  conversation?: Conversation;
}
