import React, { useState } from "react";
import type { User } from "../types";

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
}

export default function Login({ users, onLogin }: LoginProps) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = users.find(
  user => user.name === name && user.password === password
);
    if (found) {
      setError("");
      onLogin(found);
    } else {
      setError("Identifiant ou mot de passe incorrect");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-card">
        <h2>Connexion</h2>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={name}
          onChange={e => setName(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="login-input"
        />
        <button type="submit" className="login-btn">
          Se connecter
        </button>
        {error && <div className="login-error">{error}</div>}
      </form>
    </div>
  );
}
