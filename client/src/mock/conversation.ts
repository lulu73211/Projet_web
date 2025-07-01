import type { Conversation } from "../types";
import { usersMock } from "./user";

export const conversationsMock: Conversation[] = [
  {
    id: 1,
    users: [
      usersMock.find(u => u.id === 1)!,
      usersMock.find(u => u.id === 2)!
    ],
    messages: [
      {
        id: 1,
        content: "Salut Bob !",
        createdAt: new Date().toISOString(),
        authorId: 1,
        conversationId: 1,
        author: usersMock.find(u => u.id === 1)
      },
      {
        id: 2,
        content: "Salut Alice !",
        createdAt: new Date().toISOString(),
        authorId: 2,
        conversationId: 1,
        author: usersMock.find(u => u.id === 2)
      }
    ]
  }
];
