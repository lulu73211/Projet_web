import type { User, Conversation } from "../types";

interface ConversationListProps {
  user: User;
  conversations: Conversation[];
  onSelect: (conv: Conversation) => void;
}

export default function ConversationList({ user, conversations, onSelect }: ConversationListProps) {
  return (
    <div>
      <h2>Conversations de {user.username}</h2>
      <ul>
        {conversations.map(conv => {
          const otherUsers = conv.users.filter(u => u.id !== user.id).map(u => u.username).join(", ")
          return (
            <li key={conv.id} onClick={() => onSelect(conv)} style={{ cursor: "pointer" }}>
              Avec {otherUsers}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
