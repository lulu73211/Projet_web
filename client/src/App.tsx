import React, { useState } from "react";
import UserProfileForm from "./components/UserProfilForm";
import UserList from "./components/UserList";
import ConversationList from "./components/ConversationList";
import ConversationDetail from "./components/ConversationDetail";
import { usersMock } from "./mock/user";
import { conversationsMock } from "./mock/conversation";
import type { User, Conversation } from "./types";

function App() {
  const [users, setUsers] = useState<User[]>(usersMock);
  const [conversations] = useState<Conversation[]>(conversationsMock);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  return (
    <div>
      <UserProfileForm onCreate={user => setUsers([...users, user])} />
      <UserList users={users} onSelect={setSelectedUser} />
      {selectedUser && (
        <ConversationList
          user={selectedUser}
          conversations={conversations}
          onSelect={setSelectedConversation}
        />
      )}
      {selectedConversation && (
        <ConversationDetail conversation={selectedConversation} />
      )}
    </div>
  );
}

export default App;
