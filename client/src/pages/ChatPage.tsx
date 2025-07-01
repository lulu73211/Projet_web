import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar } from "@/components/ui/avatar"
import { Send, X } from "lucide-react"
import { useParams, useNavigate } from "react-router"

import { conversationsMock } from "../mock/conversation"
import type { Conversation, Message, User } from "@/types"

export default function ChatApp() {
    const { chatId } = useParams<{ chatId?: string }>()
    const navigate = useNavigate()
    const [newMessage, setNewMessage] = useState("")
    const [showPreview, setShowPreview] = useState(true)

    const [conversationStore, setConversationStore] = useState<Conversation[]>(conversationsMock)

    // Id fixe de l'utilisateur connecté (à remplacer par useUserStore plus tard)
    const myId = 1

    const extractImageUrl = (text: string): string | null => {
        const regex = /(https?:\/\/\S+\.(jpg|jpeg|png|gif|webp))/i
        const match = text.match(regex)
        return match ? match[1] : null
    }

    const imageUrl = extractImageUrl(newMessage)
    const currentConversation = conversationStore.find(c => String(c.id) === chatId)

    const handleSend = () => {
        if (!chatId || newMessage.trim() === "") return

        const image = extractImageUrl(newMessage)
        const text = image ? newMessage.replace(image, "").trim() : newMessage.trim()

        const newMsgs: Message[] = []
        const baseId = currentConversation?.messages.length ? currentConversation.messages.length + 1 : 1

        if (image) {
            newMsgs.push({
                id: baseId,
                content: image,
                createdAt: new Date().toISOString(),
                authorId: myId,
                conversationId: Number(chatId)
            })
        }
        if (text) {
            newMsgs.push({
                id: baseId + newMsgs.length,
                content: text,
                createdAt: new Date().toISOString(),
                authorId: myId,
                conversationId: Number(chatId)
            })
        }

        setConversationStore(prev =>
            prev.map(conv =>
                conv.id === Number(chatId)
                    ? { ...conv, messages: [...conv.messages, ...newMsgs] }
                    : conv
            )
        )

        setNewMessage("")
        setShowPreview(true)
    }

    const handleRemoveImage = () => {
        if (!imageUrl) return
        setShowPreview(false)
        setTimeout(() => {
            setNewMessage((prev) => prev.replace(imageUrl, "").trim())
        }, 100)
    }

    const handleSelectConversation = (id: number) => {
        navigate(`/chat/${id}`)
    }

    const getUserName = (authorId: number, conv: Conversation) => {
        return conv.users.find(u => u.id === authorId)?.username || `User #${authorId}`
    }

    const getOtherParticipantName = (conv: Conversation) => {
        const otherId = conv.users.find(u => u.id !== myId)
        return otherId?.username || `Participant`
    }

    return (
        <div className="flex h-screen w-full">
            {/* Sidebar */}
            <aside className="w-64 bg-muted border-r p-4 flex flex-col">
                <h2 className="text-lg font-semibold mb-4">Conversations</h2>
                <ScrollArea className="flex-1">
                    <div className="flex flex-col gap-2">
                        {conversationStore.map((conv) => (
                            <Button
                                key={conv.id}
                                variant={chatId === String(conv.id) ? "secondary" : "ghost"}
                                onClick={() => handleSelectConversation(conv.id)}
                                className="justify-start"
                            >
                                <Avatar className="mr-2 h-6 w-6" />
                                {getOtherParticipantName(conv)}
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
            </aside>

            {/* Chat window */}
            <main className="flex flex-col flex-1">
                {currentConversation ? (
                    <Card className="flex flex-col flex-1 rounded-none">
                        <CardHeader className="border-b">
                            <h3 className="text-lg font-semibold text-center">
                                {getOtherParticipantName(currentConversation)}
                            </h3>
                        </CardHeader>

                        <CardContent className="flex-1 overflow-hidden p-0">
                            <ScrollArea className="w-auto p-4" style={{ height: 600 }}>
                                <div className="flex flex-col gap-3">
                                    {currentConversation.messages.map((msg) => {
                                        const image = extractImageUrl(msg.content)
                                        return (
                                            <div
                                                key={msg.id}
                                                className={`max-w-sm rounded-lg px-4 py-2 text-sm ${
                                                    msg.authorId === myId
                                                        ? "bg-primary text-white self-end"
                                                        : "bg-muted text-black self-start"
                                                }`}
                                            >
                                                {image ? (
                                                    <img
                                                        src={image}
                                                        alt="image"
                                                        className="max-w-full rounded-md"
                                                    />
                                                ) : (
                                                    <>
                                                        <b>{getUserName(msg.authorId, currentConversation)}</b>: {msg.content}
                                                    </>
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
                            className="relative flex flex-col gap-2 border-t p-4"
                        >
                            <AnimatePresence>
                                {imageUrl && showPreview && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.85, y: -10 }}
                                        transition={{ duration: 0.2, ease: "easeInOut" }}
                                        className="absolute -top-36 left-4 z-50 w-32 h-32 rounded border overflow-hidden bg-white shadow-md"
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

                            <div className="flex items-center gap-2">
                                <Textarea
                                    rows={1}
                                    value={newMessage}
                                    onChange={(e) => {
                                        setNewMessage(e.target.value)
                                        setShowPreview(true)
                                    }}
                                    placeholder="Écrire un message..."
                                    className="resize-none flex-grow"
                                />
                                <Button type="submit" className="gap-2 h-10">
                                    <Send className="w-4 h-4" />
                                    Envoyer
                                </Button>
                            </div>
                        </form>
                    </Card>
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <p>Sélectionnez une conversation</p>
                    </div>
                )}
            </main>
        </div>
    )
}
