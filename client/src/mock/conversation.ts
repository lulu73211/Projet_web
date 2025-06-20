import type { Conversation } from "../types";

export const conversationsMock: Conversation[] = [
  {
    id: 1,
    users: [1, 2],
    messages: [
      { sender: 1, text: "Salut Bob !" },
      { sender: 2, text: "Salut Alice !" }
    ]
  }
];
