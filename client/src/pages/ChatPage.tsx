import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar } from "@/components/ui/avatar"
import { Send, X, Plus } from "lucide-react"
import { useParams, useNavigate } from "react-router"
import { useConversationsQuery, useConversationLazyQuery, useCreateConversationMutation, useSendMessageMutation } from "@/generated/graphql.tsx"
import type { Conversation, Message } from "@/types"
import { useUserStore } from "@/store/userStore"
import { useMessageSendSubscription  } from "@/generated/graphql"

export default function ChatApp() {
  const { chatId } = useParams<{ chatId?: string }>()
  const navigate = useNavigate()
  const { data, loading, error } = useMessageSendSubscription()
  // States
  const [conversationStore, setConversationStore] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [showPreview, setShowPreview] = useState(true)
  const [creatingConv, setCreatingConv] = useState(false)
  const [newUserId, setNewUserId] = useState<string>("") // ou email, selon ta logique
  const [errorCreating, setErrorCreating] = useState("")

  // Fix user ID connecté - à remplacer par contexte/store utilisateur
  const user = useUserStore(state => state.user)
  const myId = user?.id || 1; // Remplace par l'ID de l'utilisateur connecté
  // Queries & Mutations
  const { data: conversationsData, loading: conversationsLoading, error: conversationsError, refetch } = useConversationsQuery()
  const [fetchConversation, { data: conversationData, loading: conversationLoading, error: conversationError }] = useConversationLazyQuery()
  const [createConversationMutation, { loading: createLoading }] = useCreateConversationMutation()

  const [sendMessageMutation, { loading: sending }] = useSendMessageMutation();
    
  // Charger les conversations au montage / update
  useEffect(() => {
    if (conversationsData?.conversations) {
      setConversationStore(conversationsData.conversations)
    }
  }, [conversationsData])

  useEffect(() => {
  if (data?.messageSend) {
    const newMsg = data.messageSend

    setConversationStore(prevConversations => {
      // Mise à jour de la conversation concernée par le message reçu
      return prevConversations.map(conv => {
        if (conv.id === newMsg.conversationId) {
          // Vérifie qu'on n'a pas déjà ce message (id ici manquant dans subscription, à gérer)
          // On suppose ici que le contenu + author + date est unique pour simplifier

          const exists = conv.messages.some(msg => 
            msg.content === newMsg.content &&
            msg.authorId === newMsg.authorId &&
            msg.conversationId === newMsg.conversationId
          )
          if (exists) return conv

          return {
            ...conv,
            messages: [...conv.messages, {
              id: conv.messages.length + 1,  // ATTENTION : Id provisoire, idéalement à venir du backend
              content: newMsg.content,
              createdAt: new Date().toISOString(), // On pourrait recevoir une date dans payload ?
              authorId: newMsg.authorId,
              conversationId: newMsg.conversationId,
            }],
          }
        }
        return conv
      })
    })
    setCurrentConversation(prevConv => {
      if (prevConv && prevConv.id === newMsg.conversationId) {
        const exists = prevConv.messages.some(msg => 
          msg.content === newMsg.content &&
          msg.authorId === newMsg.authorId
        )
        if (exists) return prevConv

        return {
          ...prevConv,
          messages: [...prevConv.messages, {
            id: prevConv.messages.length + 1,
            content: newMsg.content,
            createdAt: new Date().toISOString(),
            authorId: newMsg.authorId,
            conversationId: newMsg.conversationId,
          }],
        }
      }
      return prevConv
    })
  }
  }, [data])

  // Charger conversation active au changement de chatId
  useEffect(() => {
    if (chatId) {
      fetchConversation({ variables: { id: Number(chatId) } })
    } else {
      setCurrentConversation(null)
    }
  }, [chatId, fetchConversation])

  // Mettre à jour currentConversation quand conversationData arrive
  useEffect(() => {
    if (conversationData?.conversation) {
      setCurrentConversation(conversationData.conversation)
    }
  }, [conversationData])

  // Fonction utilitaire extraction image URL
  const extractImageUrl = (text: string): string | null => {
    const regex = /(https?:\/\/\S+\.(jpg|jpeg|png|gif|webp))/i
    const match = text.match(regex)
    return match ? match[1] : null
  }

  // Envoi d’un message local (à adapter pour mutation backend)
  const handleSend = async () => {
  if (!chatId || newMessage.trim() === "") return;

  const image = extractImageUrl(newMessage);
  const text = image ? newMessage.replace(image, "").trim() : newMessage.trim();

  try {
    // Si image, on envoie un message avec le contenu image
    if (image) {
      await sendMessageMutation({
        variables: {
          input: {
            content: image,
            authorId: myId,
            conversationId: Number(chatId),
          },
        },
      });
    }

    // Si texte, on envoie un message texte
    if (text) {
      await sendMessageMutation({
        variables: {
          input: {
            content: text,
            authorId: myId,
            conversationId: Number(chatId),
          },
        },
      });
    }

    // Reset input
    setNewMessage("");
    setShowPreview(true);

  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
  }
};

  // Supprimer image du message en édition
  const imageUrl = extractImageUrl(newMessage)
  const handleRemoveImage = () => {
    if (!imageUrl) return
    setShowPreview(false)
    setTimeout(() => {
      setNewMessage((prev) => prev.replace(imageUrl, "").trim())
    }, 100)
  }

  // Sélection d’une conversation
  const handleSelectConversation = (id: number) => {
    navigate(`/chat/${id}`)
    setCreatingConv(false)
    setNewUserId("")
    setErrorCreating("")
  }

  // Création d’une nouvelle conversation
  const handleCreateConversation = async () => {
    if (!newUserId.trim()) {
      setErrorCreating("Veuillez saisir un identifiant valide")
      return
    }
    setErrorCreating("")
    try {
      if (!user?.id) return;
      const res = await createConversationMutation({
        variables: { userIds: [user?.id, Number(newUserId)] },
      })

      if (res.data?.createConversation) {
        // Ajoute la conversation créée à la liste
        setConversationStore((prev) => [...prev, res.data.createConversation])
        // Navigue vers la nouvelle conversation
        navigate(`/chat/${res.data.createConversation.id}`)
        setCreatingConv(false)
        setNewUserId("")
      } else {
        setErrorCreating("Impossible de créer la conversation")
      }
    } catch (error) {
      setErrorCreating("Erreur lors de la création de la conversation")
      console.error(error)
    }
  }

  // Fonctions pour noms utilisateurs
    
  const getUserName = (authorId: number, conv: Conversation) =>
    conv.users.find((u) => u.id === authorId)?.username || `User #${authorId}`

  const getOtherParticipantName = (conv: Conversation) => {
    const otherUser = conv.users.find((u) => u.id !== myId)
    return otherUser?.username || "Participant"
  }

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-muted border-r p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Conversations</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCreatingConv((v) => !v)}
            aria-label="Créer nouvelle conversation"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {creatingConv && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="ID utilisateur (ex: 2)"
              value={newUserId}
              onChange={(e) => setNewUserId(e.target.value)}
              className="w-full p-2 border rounded"
            />
            {errorCreating && <p className="text-red-600 text-sm">{errorCreating}</p>}
            <Button
              onClick={handleCreateConversation}
              disabled={createLoading}
              className="mt-2 w-full"
            >
              {createLoading ? "Création..." : "Créer"}
            </Button>
          </div>
        )}

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
                          <img src={image} alt="image" className="max-w-full rounded-md" />
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
              className="flex items-center gap-2 p-4 border-t"
            >
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={1}
                placeholder="Écrire un message..."
                className="resize-none"
              />

              <AnimatePresence>
                {showPreview && imageUrl && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="relative"
                  >
                    <img src={imageUrl} alt="Preview" className="max-w-xs rounded" />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={handleRemoveImage}
                      className="absolute top-0 right-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button type="submit" disabled={newMessage.trim() === ""} aria-label="Envoyer">
                <Send />
              </Button>
            </form>
          </Card>
        ) : (
          <div className="flex flex-col justify-center items-center flex-1 text-center text-muted-foreground">
            <p>Sélectionnez une conversation ou créez-en une nouvelle</p>
          </div>
        )}
      </main>
    </div>
  )
}
