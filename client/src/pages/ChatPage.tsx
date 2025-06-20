"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar } from "@/components/ui/avatar"
import { X } from "lucide-react"

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
    const [showPreview, setShowPreview] = useState(true)

    const extractImageUrl = (text: string): string | null => {
        const regex = /(https?:\/\/\S+\.(jpg|jpeg|png|gif|webp))/i
        const match = text.match(regex)
        return match ? match[1] : null
    }

    const imageUrl = extractImageUrl(newMessage)

    const handleSend = () => {
        if (newMessage.trim() === "") return

        const imageUrl = extractImageUrl(newMessage)
        const messageWithoutImage = imageUrl
            ? newMessage.replace(imageUrl, "").trim()
            : newMessage.trim()

        const newMessages: Message[] = []

        if (imageUrl) {
            newMessages.push({
                id: messages.length + 1,
                text: imageUrl,
                sender: "me",
            })
        }

        if (messageWithoutImage) {
            newMessages.push({
                id: messages.length + 1 + newMessages.length,
                text: messageWithoutImage,
                sender: "me",
            })
        }

        setMessages([...messages, ...newMessages])
        setNewMessage("")
        setShowPreview(true)
    }


    const handleRemoveImage = () => {
        if (!imageUrl) return
        setShowPreview(false)
        setTimeout(() => {
            setNewMessage((prev) => prev.replace(imageUrl, "").trim())
        }, 300) // attendre la fin de l'animation avant de nettoyer
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
                            {
                                conversations.find((c) => c.id === activeConversation)?.name
                            }
                        </h3>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-hidden p-0">
                        <ScrollArea className="h-full p-4">
                            <div className="flex flex-col gap-3">
                                {messages.map((msg) => {
                                    const imageUrl = extractImageUrl(msg.text)
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`max-w-sm rounded-lg px-4 py-2 text-sm ${
                                                msg.sender === "me"
                                                    ? "bg-primary text-white self-end"
                                                    : "bg-muted text-black self-start"
                                            }`}
                                        >
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt="image"
                                                    className="max-w-full rounded-md"
                                                />
                                            ) : (
                                                msg.text
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </ScrollArea>
                    </CardContent>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            handleSend()
                        }}
                        className="flex flex-col gap-2 border-t p-4"
                    >
                        <AnimatePresence>
                            {imageUrl && showPreview && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.85, y: -10 }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                    className="relative w-32 h-32 rounded border self-start overflow-hidden"
                                >
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-1 right-1 z-10 bg-white/80 hover:bg-white rounded-full p-1"
                                        title="Supprimer l’image"
                                    >
                                        <X className="w-4 h-4 text-red-600" />
                                    </button>
                                    <img
                                        src={imageUrl}
                                        alt="Prévisualisation"
                                        className="object-cover w-full h-full"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex items-end gap-2">
                            <Textarea
                                rows={1}
                                value={newMessage}
                                onChange={(e) => {
                                    setNewMessage(e.target.value)
                                    setShowPreview(true)
                                }}
                                placeholder="Écrire un message..."
                                className="resize-none"
                            />
                            <Button type="submit">Envoyer</Button>
                        </div>
                    </form>
                </Card>
            </main>
        </div>
    )
}
