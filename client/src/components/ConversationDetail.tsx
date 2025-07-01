import type { Conversation, User } from "../types";

interface ConversationDetailProps {
  conversation: Conversation;
}

export default function ConversationDetail({ conversation }: ConversationDetailProps) {
  const getUserName = (authorId: number) => {
    return conversation.users.find(u => u.id === authorId)?.username || `User #${authorId}`;
  };

  return (
    <div>
      <h2>Conversation avec {
        conversation.users.filter(u => u.id !== 1).map(u => u.username).join(", ")
      }</h2>
      <ul>
        {conversation.messages.map(msg => (
          <li key={msg.id}>
            <b>{getUserName(msg.authorId)}</b>: {msg.content}
          </li>
        ))}
      </ul>
    </div>
  );
}
