import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar } from "@/components/ui/avatar"
import { Send, X, Plus } from "lucide-react"
import { useParams, useNavigate } from "react-router"
import {
  useMyConversationsQuery,
  useGetMessagesLazyQuery,
  useCreateConversationMutation,
  useSendMessageMutation,
  useConversationLazyQuery,
} from "@/generated/graphql.tsx"
import { useUserStore } from "@/store/userStore"
import type { ConversationModel } from "@/generated/graphql"
import { useMessageSendSubscription } from "@/generated/graphql"

// Type local pour les messages avec les champs nécessaires
interface LocalMessage {
  id: number
  content: string
  createdAt: string
  authorId: number
  conversationId: number
  author: {
    id: number
    username: string
  }
}

// Type local pour simplifier la gestion des conversations
type LocalConversation = Pick<ConversationModel, 'id' | 'users'>

export default function ChatApp() {
  const { chatId } = useParams<{ chatId?: string }>()
  const navigate = useNavigate()
  const { data: subscriptionData } = useMessageSendSubscription()

  const [conversationStore, setConversationStore] = useState<LocalConversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<LocalConversation | null>(null)
  const [messagesStore, setMessagesStore] = useState<Map<number, LocalMessage[]>>(new Map())
  const [newMessage, setNewMessage] = useState("")
  const [showPreview, setShowPreview] = useState(true)
  const [creatingConv, setCreatingConv] = useState(false)
  const [newUserIds, setNewUserIds] = useState<string>("")
  const [errorCreating, setErrorCreating] = useState("")

  const user = useUserStore(state => state.user)
  const myId = user?.id || 1

  const { data: conversationsData, refetch: refetchConversations } = useMyConversationsQuery()
  const [fetchMessage, { data: conversationMessage }] = useGetMessagesLazyQuery()
  const [fetchConversation, { data: conversationData }] = useConversationLazyQuery()

  const [createConversationMutation, { loading: createLoading }] = useCreateConversationMutation()
  const [sendMessageMutation] = useSendMessageMutation()

  // Chargement initial des conversations et sélection selon chatId
  useEffect(() => {
    if (conversationsData?.myConversations) {
      setConversationStore(conversationsData.myConversations as LocalConversation[])
      if (chatId) {
        const conv = conversationsData.myConversations.find(c => String(c.id) === chatId)
        setCurrentConversation(conv as LocalConversation || null)
      } else {
        setCurrentConversation(null)
      }
    }
  }, [conversationsData, chatId])

  // Mise à jour du store des messages lors de la réception d'un nouveau message par subscription
  useEffect(() => {
    if (subscriptionData?.messageSend) {
      const newMsg = subscriptionData.messageSend
      const conversationId = newMsg.conversationId
      
      // Trouver la conversation pour récupérer les infos utilisateur
      const conversation = conversationStore.find(c => c.id === conversationId)
      const author = conversation?.users.find(u => u.id === newMsg.authorId)
      
      setMessagesStore(prev => {
        const currentMessages = prev.get(conversationId) || []
        
        // Éviter les doublons
        const isDuplicate = currentMessages.some(m =>
          m.content === newMsg.content && m.authorId === newMsg.authorId
        )
        
        if (isDuplicate) return prev
        
        const newMessage: LocalMessage = {
          id: Date.now(), // ID temporaire
          content: newMsg.content,
          createdAt: new Date().toISOString(),
          authorId: newMsg.authorId,
          conversationId: newMsg.conversationId,
          author: {
            id: newMsg.authorId,
            username: author?.username || `User #${newMsg.authorId}`
          }
        }
        
        const updatedMessages = [...currentMessages, newMessage]
        const newMap = new Map(prev)
        newMap.set(conversationId, updatedMessages)
        return newMap
      })
    }
  }, [subscriptionData, conversationStore])

  // Chargement des messages si non déjà dans le store quand on change de conversation
  useEffect(() => {
    if (!chatId) return
    const conversationId = Number(chatId)
    const existingMessages = messagesStore.get(conversationId)
    
    if (existingMessages && existingMessages.length > 0) {
      return // Messages déjà chargés
    }
    
    fetchMessage({ variables: { conversationId } })
  }, [chatId, messagesStore, fetchMessage])

  // Mise à jour du store avec les messages récupérés via getMessage
  useEffect(() => {
    if (conversationMessage?.getMessages && chatId) {
      const conversationId = Number(chatId)
      const messages: LocalMessage[] = conversationMessage.getMessages.map(msg => ({
        id: msg.id,
        content: msg.content,
        createdAt: msg.createdAt,
        authorId: msg.author.id,
        conversationId: conversationId,
        author: {
          id: msg.author.id,
          username: msg.author.username
        }
      }))
      
      setMessagesStore(prev => {
        const newMap = new Map(prev)
        newMap.set(conversationId, messages)
        return newMap
      })
    }
  }, [conversationMessage, chatId])

  // Mise à jour de la conversation courante depuis lazy query
  useEffect(() => {
    if (conversationData?.conversation) {
      setCurrentConversation(conversationData.conversation as LocalConversation)
      setConversationStore(prev => {
        if (!prev.some(c => c.id === conversationData.conversation!.id)) {
          return [...prev, conversationData.conversation! as LocalConversation]
        }
        return prev
      })
    }
  }, [conversationData])

  // Extraction d'une URL d'image dans un texte
  const extractImageUrl = (text: string): string | null => {
    const regex = /(https?:\/\/\S+\.(jpg|jpeg|png|gif|webp))/i
    const match = text.match(regex)
    return match ? match[1] : null
  }

  // Envoi du message (envoi image et texte séparés si les deux sont présents)
  const handleSend = async () => {
    if (!chatId || newMessage.trim() === "") return
    const image = extractImageUrl(newMessage)
    const text = image ? newMessage.replace(image, "").trim() : newMessage.trim()
    try {
      if (image) {
        await sendMessageMutation({
          variables: { input: { content: image, authorId: myId, conversationId: Number(chatId) } },
        })
      }
      if (text) {
        await sendMessageMutation({
          variables: { input: { content: text, authorId: myId, conversationId: Number(chatId) } },
        })
      }
      setNewMessage("")
      setShowPreview(true)
    } catch (err) {
      console.error("Erreur lors de l'envoi du message:", err)
    }
  }

  // Suppression de l'image dans le textarea (cache la preview puis supprime le lien)
  const imageUrl = extractImageUrl(newMessage)
  const handleRemoveImage = () => {
    if (!imageUrl) return
    setShowPreview(false)
    setTimeout(() => setNewMessage(prev => prev.replace(imageUrl, "").trim()), 100)
  }

  // Sélection d'une conversation dans la liste (navigue + reset création)
  const handleSelectConversation = (id: number) => {
    navigate(`/chat/${id}`)
    setCreatingConv(false)
    setNewUserIds("")
    setErrorCreating("")
  }

  // Création d'une nouvelle conversation avec IDs d'utilisateurs
  const handleCreateConversation = async () => {
    if (!newUserIds.trim()) {
      setErrorCreating("Veuillez saisir au moins un identifiant")
      return
    }
    setErrorCreating("")
    try {
      if (!user?.id) return
      const ids = newUserIds
        .split(",")
        .map(s => Number(s.trim()))
        .filter(n => !isNaN(n))

      if (!ids.includes(user.id)) ids.unshift(user.id)

      const res = await createConversationMutation({ variables: { userIds: ids } })

      if (res.data?.createConversation) {
        const newConv = {
          ...res.data.createConversation,
          users: res.data.createConversation.users || [],
          messages: [], // Evite erreur .map sur undefined
        }

        // Ajouter la conversation au store local
        setConversationStore(prev => [...prev, newConv as unknown as LocalConversation])
        
        // Refetch les conversations pour synchroniser avec le serveur
        refetchConversations()
        
        navigate(`/chat/${newConv.id}`)
        setCreatingConv(false)
        setNewUserIds("")
      } else {
        setErrorCreating("Impossible de créer la conversation")
      }
    } catch (err) {
      setErrorCreating("Erreur lors de la création de la conversation")
      console.error(err)
    }
  }

  // Si chatId change et que la conversation n'est pas en store, fetch côté serveur
  useEffect(() => {
    if (!chatId || !conversationStore.length) return

    const conv = conversationStore.find(c => String(c.id) === chatId)
    if (conv) {
      setCurrentConversation(conv)
      fetchMessage({ variables: { conversationId: Number(chatId) } })
    } else {
      fetchConversation({ variables: { id: Number(chatId) } })
    }
  }, [chatId, conversationStore, fetchMessage, fetchConversation])

  // Helper pour générer le nom d'une conversation (concat utilisateurs triés)
  const getConversationName = (conv: ConversationModel) =>
    [...conv.users]
      .sort((a, b) => a.id - b.id)
      .map(u => u.username)
      .join(", ")

  return (
    <div className="flex h-screen w-full">
      <aside className="w-64 bg-muted border-r p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Conversations</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCreatingConv(v => !v)}
            aria-label="Créer nouvelle conversation"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {creatingConv && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="IDs utilisateurs séparés par virgule (ex: 2,3,4)"
              value={newUserIds}
              onChange={e => setNewUserIds(e.target.value)}
              className="w-full p-2 border rounded"
            />
            {errorCreating && <p className="text-red-600 text-sm">{errorCreating}</p>}
            <Button onClick={handleCreateConversation} disabled={createLoading} className="mt-2 w-full">
              {createLoading ? "Création..." : "Créer"}
            </Button>
          </div>
        )}

        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-2">
            {conversationStore.map(conv => (
              <Button
                key={conv.id}
                variant={chatId === String(conv.id) ? "secondary" : "ghost"}
                onClick={() => handleSelectConversation(conv.id)}
                className="justify-start"
              >
                <Avatar className="mr-2 h-6 w-6" />
                {getConversationName(conv)}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </aside>

      <main className="flex flex-col flex-1">
        {currentConversation ? (
          <Card className="flex flex-col flex-1 rounded-none">
            <CardHeader className="border-b">
              <h3 className="text-lg font-semibold text-center">{getConversationName(currentConversation)}</h3>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="w-auto p-4" style={{ height: 600 }}>
                <div className="flex flex-col gap-3">
                  {(messagesStore.get(Number(chatId)) || []).map(msg => {
                    const image = extractImageUrl(msg.content)
                    return (
                      <div
                        key={msg.id}
                        className={`max-w-sm rounded-lg px-4 py-2 text-sm ${
                          msg.authorId === myId ? "bg-primary text-white self-end" : "bg-muted text-black self-start"
                        }`}
                      >
                        {image ? (
                          <img src={image} alt="image" className="max-w-full rounded-md" />
                        ) : (
                          <>
                            <b>{msg.author.username}</b>: {msg.content}
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>

            <form
              onSubmit={e => {
                e.preventDefault()
                handleSend()
              }}
              className="flex items-center gap-2 p-4 border-t"
            >
              <Textarea
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
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
