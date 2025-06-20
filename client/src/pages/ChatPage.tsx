"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
// import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar } from "@/components/ui/avatar"

type Message = {
    id: number
    text: string
    sender: "me" | "other"
}

const conversations = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
]

export default function ChatApp() {
    const [activeConversation, setActiveConversation] = useState(1)
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Salut !", sender: "other" },
        { id: 2, text: "Comment ça va ?", sender: "me" },
    ])
    const [newMessage, setNewMessage] = useState("")

    const handleSend = () => {
        if (newMessage.trim() === "") return
        setMessages([
            ...messages,
            { id: messages.length + 1, text: newMessage, sender: "me" },
        ])
        setNewMessage("")
    }

    return (
        <div className="flex h-screen w-full">
            {/* Sidebar */}
            <aside className="w-64 bg-muted border-r p-4 flex flex-col">
                <h2 className="text-lg font-semibold mb-4">Conversations</h2>
                <ScrollArea className="flex-1">
                    <div className="flex flex-col gap-2">
                        {conversations.map((conv) => (
                            <Button
                                key={conv.id}
                                variant={conv.id === activeConversation ? "secondary" : "ghost"}
                                onClick={() => setActiveConversation(conv.id)}
                                className="justify-start"
                            >
                                <Avatar className="mr-2 h-6 w-6" />
                                {conv.name}
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
            </aside>

            {/* Chat Window */}
            <main className="flex flex-col flex-1">
                <Card className="flex flex-col flex-1 rounded-none">
                    <CardHeader className="border-b">
                        <h3 className="text-lg font-semibold">
                            {conversations.find((c) => c.id === activeConversation)?.name}
                        </h3>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-hidden p-0">
                        <ScrollArea className="h-full p-4">
                            <div className="flex flex-col gap-3">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`max-w-sm rounded-lg px-4 py-2 text-sm ${
                                            msg.sender === "me"
                                                ? "bg-primary text-white self-end"
                                                : "bg-muted text-black self-start"
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            handleSend()
                        }}
                        className="flex items-center gap-2 border-t p-4"
                    >
                        <Textarea
                            rows={1}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Écrire un message..."
                            className="resize-none"
                        />
                        <Button type="submit">Envoyer</Button>
                    </form>
                </Card>
            </main>
        </div>
    )
}
