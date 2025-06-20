import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar } from "@/components/ui/avatar"
import { X } from "lucide-react"
import { useParams, useNavigate } from "react-router"

// Types
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
    const { chatId } = useParams<{ chatId?: string }>()
    const navigate = useNavigate()
    const [newMessage, setNewMessage] = useState("")
    const [showPreview, setShowPreview] = useState(true)

    // Exemple : chaque chat a sa propre liste de messages (faux backend ici)
    const [messageStore, setMessageStore] = useState<Record<string, Message[]>>({
        "1": [
            { id: 1, text: "Salut Alice", sender: "other" },
            { id: 2, text: "Comment ça va ?", sender: "me" },
        ],
        "2": [
            { id: 1, text: "Yo Bob !", sender: "other" },
            { id: 2, text: "Ça roule ?", sender: "me" },
        ],
        "3": [{ id: 1, text: "Hey Charlie 👋", sender: "me" }],
    })

    const extractImageUrl = (text: string): string | null => {
        const regex = /(https?:\/\/\S+\.(jpg|jpeg|png|gif|webp))/i
        const match = text.match(regex)
        return match ? match[1] : null
    }

    const imageUrl = extractImageUrl(newMessage)
    const messages = chatId ? messageStore[chatId] ?? [] : []

    const handleSend = () => {
        if (!chatId || newMessage.trim() === "") return

        const image = extractImageUrl(newMessage)
        const text = image ? newMessage.replace(image, "").trim() : newMessage.trim()
        const base = messages.length + 1

        const newMsgs: Message[] = []

        if (image) {
            newMsgs.push({ id: base, text: image, sender: "me" })
        }
        if (text) {
            newMsgs.push({ id: base + newMsgs.length, text, sender: "me" })
        }

        setMessageStore((prev) => ({
            ...prev,
            [chatId]: [...(prev[chatId] || []), ...newMsgs],
        }))

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
                                variant={chatId === String(conv.id) ? "secondary" : "ghost"}
                                onClick={() => handleSelectConversation(conv.id)}
                                className="justify-start"
                            >
                                <Avatar className="mr-2 h-6 w-6" />
                                {conv.name}
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
            </aside>

            {/* Chat window */}
            <main className="flex flex-col flex-1">
                {chatId ? (
                    <Card className="flex flex-col flex-1 rounded-none">
                        <CardHeader className="border-b">
                            <h3 className="text-lg font-semibold text-center">
                                {conversations.find((c) => String(c.id) === chatId)?.name}
                            </h3>
                        </CardHeader>

                        <CardContent className="flex-1 overflow-hidden p-0">
                            <ScrollArea className="h-full p-4">
                                <div className="flex flex-col gap-3">
                                    {messages.map((msg) => {
                                        const image = extractImageUrl(msg.text)
                                        return (
                                            <div
                                                key={msg.id}
                                                className={`max-w-sm rounded-lg px-4 py-2 text-sm ${
                                                    msg.sender === "me"
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
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <p>Sélectionnez une conversation</p>
                    </div>
                )}
            </main>
        </div>
    )
}
