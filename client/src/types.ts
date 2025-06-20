export interface User {
  id: number;
  name: string;
  password: string;
}

export interface Message {
  sender: number;
  text: string;
}

export interface Conversation {
  id: number;
  users: number[];
  messages: Message[];
}
