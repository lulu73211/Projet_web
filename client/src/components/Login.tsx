// src/components/Login.tsx
import React, { useState } from "react";
import type { User } from "../types";

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
  children: (props: {
    email: string;
    password: string;
    error: string;
    onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  }) => React.ReactNode;
}

export default function Login({ users, onLogin, children }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = users.find(
      user => user.email === email && user.password === password
    );
    if (found) {
      setError("");
      onLogin(found);
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
