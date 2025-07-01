import type { User } from "../types";

export const usersMock: User[] = [
  {
    id: 1,
    email: "alice@example.com",
    username: "Alice",
    password: "alice123",
    firstName: "Alice",
    lastName: "Dupont",
    isActive: true,
    roles: ["USER"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    email: "bob@example.com",
    username: "Bob",
    password: "bob123",
    firstName: "Bob",
    lastName: "Martin",
    isActive: true,
    roles: ["USER"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
