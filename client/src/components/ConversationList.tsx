import type { User, Conversation } from "../types";

interface ConversationListProps {
  user: User;
  conversations: Conversation[];
  onSelect: (conv: Conversation) => void;
}

export default function ConversationList({
  user,
  conversations,
  onSelect
}: ConversationListProps) {
  const userConversations = conversations.filter(conv => conv.users.includes(user.id));

  return (
    <div>
      <h2>Conversations de {user.name}</h2>
      <ul>
        {userConversations.map(conv => (
          <li key={conv.id} onClick={() => onSelect(conv)} style={{ cursor: "pointer" }}>
            Conversation #{conv.id}
          </li>
        ))}
      </ul>
    </div>
  );
}
