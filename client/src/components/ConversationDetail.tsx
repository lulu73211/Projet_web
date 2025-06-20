import type { Conversation, User } from "../types";

interface ConversationDetailProps {
  conversation: Conversation;
  users: User[];
}

export default function ConversationDetail({ conversation, users }: ConversationDetailProps) {
  // Petite fonction pour trouver le nom selon l'id
  const getUserName = (id: number) => {
    const user = users.find(u => u.id === id);
    return user ? user.name : `Utilisateur #${id}`;
  };

  return (
    <div>
      <h2>Détails de la conversation #{conversation.id}</h2>
      <ul>
        {conversation.messages.map((m, idx) => (
          <li key={idx}>
            <b>{getUserName(m.sender)}</b> : {m.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
