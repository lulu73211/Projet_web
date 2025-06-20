// src/components/Login.tsx
import React, { useState } from "react";
import type { User } from "../types";
import { useUserStore } from "@/store/userStore.ts";

interface LoginProps {
  users: User[];
  children: (props: {
    email: string;
    password: string;
    error: string;
    onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  }) => React.ReactNode;
}

export default function Login({ users, children }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const setUser = useUserStore((state) => state.setUser);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = users.find(
      user => user.email === email && user.password === password
    );
    if (found) {
      setError("");
      setUser({ id: found.id, password : found.password, name : found.name, email : found.email, jwt : "yo" });
    } else {
      setError("Identifiant ou mot de passe incorrect");
    }
  };

  return children({
    email,
    password,
    error,
    onEmailChange: e => setEmail(e.target.value),
    onPasswordChange: e => setPassword(e.target.value),
    onSubmit: handleSubmit,
  });
}
