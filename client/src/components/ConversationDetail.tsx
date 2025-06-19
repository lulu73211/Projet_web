import type { Conversation } from "../types";

interface ConversationDetailProps {
  conversation: Conversation;
}

export default function ConversationDetail({ conversation }: ConversationDetailProps) {
  return (
    <div>
      <h2>Détails de la conversation #{conversation.id}</h2>
      <ul>
        {conversation.messages.map((m, idx) => (
          <li key={idx}>
            <b>Utilisateur #{m.sender}</b> : {m.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
