import React, { useState } from "react";
import Login from "./components/Login";
//import UserList from "./components/UserList";
import ConversationList from "./components/ConversationList";
import ConversationDetail from "./components/ConversationDetail";
import { usersMock } from "./mock/user";
import { conversationsMock } from "./mock/conversation";
import type { User, Conversation } from "./types";
import "./App.css"; // Ajoute le fichier de style en-dessous

function App() {
  const [users] = useState<User[]>(usersMock);
  const [conversations] = useState<Conversation[]>(conversationsMock);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  // Filtrer les conversations où l'utilisateur est présent
  const userConversations = currentUser
    ? conversations.filter(conv => conv.users.includes(currentUser.id))
    : [];

  return (
    <div className="main-app-container">
      {!currentUser ? (
        <Login users={users} onLogin={setCurrentUser} />
      ) : (
        <div className="messenger-container">
          <div className="sidebar">
            <div className="profile">
              <span className="profile-circle">{currentUser.name[0]}</span>
              <span className="profile-name">{currentUser.name}</span>
              <button className="logout-btn" onClick={() => { setCurrentUser(null); setSelectedConversation(null); }}>Déconnexion</button>
            </div>
            <ConversationList
              user={currentUser}
              conversations={userConversations}
              onSelect={setSelectedConversation}
            />
          </div>
          <div className="content">
            {selectedConversation ? (
              <ConversationDetail conversation={selectedConversation} />
            ) : (
              <div className="empty-detail">
                <h2>Sélectionnez une conversation</h2>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
