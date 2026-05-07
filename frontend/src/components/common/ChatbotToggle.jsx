import { useEffect, useRef, useState } from 'react'
import chatbotService from '../../services/chatbotService'
import {
  Bot,
  ChevronDown,
  Leaf,
  Loader2,
  MessageCircle,
  Plus,
  Send,
  Sparkles,
  X,
} from 'lucide-react'

const quickPrompts = [
  { label: 'Rekomendasi', text: 'Rekomendasi tanaman padi' },
  { label: 'Gejala', text: 'Daun cabai menguning kenapa?' },
  { label: 'Pemupukan', text: 'Tips pemupukan jagung' },
]

const topicChips = [
  'Tanaman cocok',
  'Hama penyakit',
  'Pupuk',
  'Kearifan lokal',
]

const intentLabels = {
  recommendation: 'Rekomendasi tanam',
  fertilizer: 'Pemupukan',
  plant_health: 'Kesehatan tanaman',
  local_wisdom: 'Kearifan lokal',
  faq: 'Knowledge base',
  fallback: 'Asisten tani',
}

const followUpPrompts = {
  recommendation: ['Apa tips perawatannya?', 'Cocok untuk tanah lempung?', 'Bandingkan dengan jagung'],
  fertilizer: ['Kapan waktu pupuk terbaik?', 'Berapa kali pemupukan?', 'Apa tanda kekurangan nitrogen?'],
  plant_health: ['Apa tindakan pertama?', 'Pestisida apa yang aman?', 'Bagaimana mencegahnya?'],
  local_wisdom: ['Contoh penerapannya?', 'Cocok untuk padi?', 'Apa manfaat utamanya?'],
  faq: ['Ada contoh lain?', 'Bisa pakai data lahan saya?', 'Apa langkah berikutnya?'],
  fallback: ['Rekomendasi tanaman padi', 'Daun cabai menguning kenapa?', 'Tips pemupukan jagung'],
}

const formatTime = (value) => {
  if (!value) return ''
  return new Date(value).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getMessageIntent = (message) => message?.metadata?.intent || 'fallback'

const getSourceLabel = (source) => source.title || source.name || `Referensi ${source.id}`

const ChatbotToggle = () => {
  const [open, setOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [sessions, setSessions] = useState([])
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loadingSessions, setLoadingSessions] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)
  const localMessageIdRef = useRef(0)

  useEffect(() => {
    if (!open) return

    let active = true

    const loadSessions = async () => {
      setLoadingSessions(true)
      try {
        const res = await chatbotService.getSessions()
        if (active) setSessions(res.data || [])
      } catch (err) {
        if (active) setError(err.message || 'Gagal memuat riwayat chat.')
      } finally {
        if (active) setLoadingSessions(false)
      }
    }

    loadSessions()
    return () => { active = false }
  }, [open])

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [open, messages, sending])

  const refreshSessions = async () => {
    const res = await chatbotService.getSessions()
    setSessions(res.data || [])
  }

  const loadSession = async (sessionId) => {
    setActiveSessionId(sessionId)
    setHistoryOpen(false)
    setLoadingMessages(true)
    setError('')

    try {
      const res = await chatbotService.getSession(sessionId)
      setMessages(res.data?.messages || [])
    } catch (err) {
      setError(err.message || 'Gagal memuat percakapan.')
    } finally {
      setLoadingMessages(false)
    }
  }

  const startNewChat = () => {
    setActiveSessionId(null)
    setMessages([])
    setInput('')
    setError('')
    setHistoryOpen(false)
  }

  const submitMessage = async (messageText = input) => {
    const message = messageText.trim()
    if (!message || sending) return

    const optimisticUserMessage = {
      id: `local-${localMessageIdRef.current += 1}`,
      role: 'user',
      content: message,
      created_at: new Date().toISOString(),
    }

    setInput('')
    setError('')
    setSending(true)
    setMessages((current) => [...current, optimisticUserMessage])

    try {
      const res = await chatbotService.sendMessage({
        message,
        sessionId: activeSessionId,
      })
      const sessionId = res.data?.session?.id
      const responseMessages = res.data?.messages || []

      setActiveSessionId(sessionId || activeSessionId)
      setMessages((current) => [
        ...current.filter((item) => item.id !== optimisticUserMessage.id),
        ...responseMessages,
      ])
      await refreshSessions()
    } catch (err) {
      setMessages((current) => current.filter((item) => item.id !== optimisticUserMessage.id))
      setError(err.message || 'Gagal mengirim pesan.')
    } finally {
      setSending(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    submitMessage()
  }

  const activeSession = sessions.find((session) => session.id === activeSessionId)
  const lastAssistantMessage = [...messages].reverse().find((message) => message.role === 'assistant')
  const followUps = followUpPrompts[getMessageIntent(lastAssistantMessage)] || followUpPrompts.fallback

  return (
    <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      <div 
        className={`absolute bottom-full right-0 mb-4 w-[calc(100vw-2rem)] max-w-[420px] h-[min(680px,calc(100vh-7rem))] bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden flex flex-col transition-all duration-500 origin-bottom-right ${
          open ? 'scale-100 opacity-100 translate-y-0 pointer-events-auto' : 'scale-95 opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white px-5 py-4 flex items-center gap-3 relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-500/20 rounded-full blur-xl -ml-8 -mb-8 pointer-events-none"></div>
          
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shrink-0 shadow-inner z-10">
            <Bot size={22} className="text-white drop-shadow-md" />
          </div>
          <div className="min-w-0 flex-1 z-10">
            <h3 className="font-bold text-[15px] leading-tight flex items-center gap-2 drop-shadow-sm">
              Asisten TaniBijak
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold bg-white/20 backdrop-blur-sm border border-white/20 px-2.5 py-0.5 rounded-full shadow-sm">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Online
              </span>
            </h3>
            <p className="text-xs text-primary-100 truncate mt-0.5 opacity-90">{activeSession?.title || 'Tanya cepat soal pertanian'}</p>
          </div>
          <div className="flex items-center gap-1 z-10">
            <button
              type="button"
              onClick={startNewChat}
              className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Chat baru"
            >
              <Plus size={18} />
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Tutup chatbot"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="relative border-b border-gray-100 bg-white z-20">
          <button
            type="button"
            onClick={() => setHistoryOpen((value) => !value)}
            className="w-full px-5 py-3 flex items-center justify-between gap-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            <span className="truncate">{activeSession?.title || 'Pilih riwayat chat'}</span>
            <ChevronDown size={16} className={`shrink-0 text-gray-400 transition-transform duration-300 ${historyOpen ? 'rotate-180' : ''}`} />
          </button>

          <div 
            className={`absolute left-0 right-0 top-full bg-white border-b border-gray-200 shadow-lg overflow-hidden transition-all duration-300 origin-top ${
              historyOpen ? 'max-h-64 opacity-100 border-b' : 'max-h-0 opacity-0 border-b-0'
            }`}
          >
            <div className="p-2 overflow-y-auto max-h-64">
              {loadingSessions && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 py-4">
                  <Loader2 size={16} className="animate-spin" /> Memuat riwayat...
                </div>
              )}

              {!loadingSessions && sessions.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">Belum ada riwayat chat.</p>
              )}

              {sessions.map((session) => (
                <button
                  type="button"
                  key={session.id}
                  onClick={() => loadSession(session.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeSessionId === session.id ? 'bg-primary-50 text-primary-900 shadow-sm border border-primary-100/50' : 'hover:bg-gray-50 text-gray-700 border border-transparent'
                  }`}
                >
                  <p className="font-semibold text-sm truncate">{session.title || 'Percakapan baru'}</p>
                  <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1.5">
                    <MessageCircle size={10} />
                    {formatTime(session.updated_at)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-5 scroll-smooth" onClick={() => setHistoryOpen(false)}>
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
              <div className="mt-0.5"><X size={16} /></div>
              {error}
            </div>
          )}

          {loadingMessages && (
            <div className="h-full flex flex-col items-center justify-center text-sm text-gray-500 gap-3">
              <Loader2 size={24} className="animate-spin text-primary-600" />
              <p>Memuat percakapan...</p>
            </div>
          )}

          {!loadingMessages && messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 animate-in fade-in duration-500">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 shadow-inner flex items-center justify-center mb-5 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/40"></div>
                <Sparkles size={28} className="text-primary-700 relative z-10" />
              </div>
              <h4 className="text-lg font-extrabold text-gray-800 mb-1">Mau tanya apa hari ini?</h4>
              <p className="text-sm text-gray-500 mb-6 max-w-[240px]">Pilih contoh topik di bawah atau tulis kondisi lahan kamu.</p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {topicChips.map((topic) => (
                  <span key={topic} className="inline-flex items-center gap-1.5 rounded-full bg-white border border-gray-200 shadow-sm px-3 py-1.5 text-xs font-semibold text-gray-700">
                    <Leaf size={12} className="text-primary-600" /> {topic}
                  </span>
                ))}
              </div>
              <div className="w-full space-y-2.5">
                {quickPrompts.map((prompt) => (
                  <button
                    type="button"
                    key={prompt.text}
                    onClick={() => submitMessage(prompt.text)}
                    className="w-full text-left bg-white border border-gray-200 hover:border-primary-300 hover:shadow-md rounded-xl px-4 py-3 text-sm text-gray-700 transition-all duration-200 group"
                  >
                    <span className="block text-[11px] font-bold text-primary-700 mb-1 uppercase tracking-wider group-hover:text-primary-800">{prompt.label}</span>
                    <span className="font-medium">{prompt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loadingMessages && messages.length > 0 && (
            <div className="space-y-4 pb-2">
              {messages.map((message) => {
                const isUser = message.role === 'user'
                const intent = getMessageIntent(message)
                const sources = message.metadata?.sources || []
                return (
                  <div key={message.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    {!isUser && (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-700 to-primary-900 text-white flex items-center justify-center shrink-0 mt-1 shadow-md">
                        <Bot size={18} />
                      </div>
                    )}
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm relative ${
                      isUser
                        ? 'bg-gradient-to-br from-primary-700 to-primary-800 text-white rounded-tr-sm'
                        : 'bg-white text-gray-700 border border-gray-100 rounded-tl-sm shadow-md'
                    }`}>
                      {!isUser && (
                        <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-primary-50 border border-primary-100 px-2.5 py-1 text-[10px] font-bold text-primary-800">
                          <Sparkles size={12} className="text-primary-600" /> {intentLabels[intent] || 'Asisten tani'}
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-line leading-relaxed font-medium">{message.content}</p>
                      {!isUser && sources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-1.5">
                          {sources.slice(0, 3).map((source) => (
                            <span key={`${source.type}-${source.id}`} className="rounded-md bg-gray-50 border border-gray-200 px-2 py-1 text-[10px] font-semibold text-gray-600 flex items-center gap-1">
                              {getSourceLabel(source)}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className={`text-[10px] mt-2 font-medium ${isUser ? 'text-primary-200 text-right' : 'text-gray-400'}`}>
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                )
              })}

              {sending && (
                <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-700 to-primary-900 text-white flex items-center justify-center shrink-0 mt-1 shadow-md mr-3">
                    <Bot size={18} />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3.5 text-sm text-gray-500 flex items-center gap-3 shadow-md">
                    <span className="flex gap-1.5">
                      <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:300ms]" />
                    </span>
                  </div>
                </div>
              )}
              {!sending && lastAssistantMessage && (
                <div className="pt-2 pl-12 animate-in fade-in duration-500">
                  <p className="text-[11px] font-bold text-gray-400 mb-2.5 uppercase tracking-wider">Lanjut tanya:</p>
                  <div className="flex flex-wrap gap-2">
                    {followUps.map((prompt) => (
                      <button
                        type="button"
                        key={prompt}
                        onClick={() => submitMessage(prompt)}
                        className="rounded-full bg-white border border-gray-200 shadow-sm hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 px-3.5 py-1.5 text-xs font-semibold text-gray-600 transition-all duration-200"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-2" />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t border-gray-100 bg-white p-4 relative z-20">
          <div className="flex gap-2 relative">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Tulis pertanyaan seputar pertanian..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all duration-200 text-sm text-gray-700 placeholder:text-gray-400 pr-12"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className={`absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg flex items-center justify-center transition-all duration-200 ${
                !input.trim() 
                  ? 'text-gray-400 bg-transparent' 
                  : 'bg-primary-700 text-white hover:bg-primary-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
              } disabled:opacity-50 disabled:transform-none disabled:shadow-none`}
              aria-label="Kirim pesan"
            >
              {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
        </form>
      </div>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-500 z-50 ${
          open 
            ? 'bg-red-500 hover:bg-red-600 text-white rotate-90' 
            : 'bg-primary-800 hover:bg-primary-900 text-white hover:-translate-y-1 hover:shadow-2xl'
        }`}
        aria-label={open ? 'Tutup chatbot' : 'Buka chatbot'}
      >
        {open ? <X size={24} className="transition-transform duration-500" /> : <MessageCircle size={26} className="transition-transform duration-500" />}
      </button>
    </div>
  )
}

export default ChatbotToggle

