import React, { useState } from "react";
import type { User } from "../types";

interface UserProfileFormProps {
  onCreate: (user: User) => void;
}

export default function UserProfileForm({ onCreate }: UserProfileFormProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate({ id: Date.now(), name });
      setName("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Nom utilisateur"
      />
      <button type="submit">Créer</button>
    </form>
  );
}
