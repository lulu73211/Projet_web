import React, { useState } from "react";
import ConversationList from "./components/ConversationList";
import ConversationDetail from "./components/ConversationDetail";
import { conversationsMock } from "./mock/conversation";
import type { Conversation, User } from "./types";
import "./App.css";
import { useUserStore } from "@/store/userStore.ts";
import { usersMock } from "@/mock/user.ts";

function App() {
  const [users] = useState<User[]>(usersMock);
  const [conversations] = useState<Conversation[]>(conversationsMock);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const userConversations = user
    ? conversations.filter(conv => conv.users.includes(user.id))
    : [];

  console.log(user);
  return (
    <div className="main-app-container">
        <div className="messenger-container">
          <div className="sidebar">
            <div className="profile">
              <span className="profile-circle">{user?.name[0]}</span>
              <span className="profile-name">{user?.name}</span>
              <button className="logout-btn" onClick={() => { setUser(null); setSelectedConversation(null); }}>Déconnexion</button>
            </div>
            {
              user ? <ConversationList
                  user={user}
                  conversations={userConversations}
                  onSelect={setSelectedConversation}
              /> : null
            }
          </div>
          <div className="content">
            {selectedConversation ? (
              <ConversationDetail
                conversation={selectedConversation}
                users={users}
              />
            ) : (
              <div className="empty-detail">
                <h2>Sélectionnez une conversation</h2>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}

export default App;
