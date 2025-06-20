export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  jwt: string | null;
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
