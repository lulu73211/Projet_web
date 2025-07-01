import type { Conversation } from "../types";

export const conversationsMock: Conversation[] = [
  {
    id: 1,
    users: [1, 2],
    messages: [
      {
        id: 1,
        content: "Salut Bob !",
        createdAt: new Date().toISOString(),
        authorId: 1,
        conversationId: 1
      },
      {
        id: 2,
        content: "Salut Alice !",
        createdAt: new Date().toISOString(),
        authorId: 2,
        conversationId: 1
      }
    ]
  }
];
