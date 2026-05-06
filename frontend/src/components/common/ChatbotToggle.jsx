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
      {open && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-[420px] h-[min(680px,calc(100vh-7rem))] bg-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden flex flex-col">
          <div className="bg-primary-800 text-white px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <Bot size={19} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold leading-tight flex items-center gap-2">
                Asisten TaniBijak
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-white/15 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full" /> Online
                </span>
              </h3>
              <p className="text-xs text-primary-100 truncate">{activeSession?.title || 'Tanya cepat soal pertanian'}</p>
            </div>
            <button
              type="button"
              onClick={startNewChat}
              className="w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
              aria-label="Chat baru"
            >
              <Plus size={18} />
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
              aria-label="Tutup chatbot"
            >
              <X size={18} />
            </button>
          </div>

          <div className="relative border-b border-gray-100 bg-white">
            <button
              type="button"
              onClick={() => setHistoryOpen((value) => !value)}
              className="w-full px-4 py-2.5 flex items-center justify-between gap-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span className="truncate">{activeSession?.title || 'Pilih riwayat chat'}</span>
              <ChevronDown size={16} className={`shrink-0 transition-transform ${historyOpen ? 'rotate-180' : ''}`} />
            </button>

            {historyOpen && (
              <div className="absolute left-3 right-3 top-full mt-2 max-h-64 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-10">
                {loadingSessions && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 px-3 py-3">
                    <Loader2 size={15} className="animate-spin" /> Memuat riwayat...
                  </div>
                )}

                {!loadingSessions && sessions.length === 0 && (
                  <p className="text-sm text-gray-500 px-3 py-3">Belum ada riwayat chat.</p>
                )}

                {sessions.map((session) => (
                  <button
                    type="button"
                    key={session.id}
                    onClick={() => loadSession(session.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                      activeSessionId === session.id ? 'bg-primary-50 text-primary-900' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <p className="font-semibold text-sm truncate">{session.title || 'Percakapan baru'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatTime(session.updated_at)}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-50/70 p-4">
            {error && (
              <div className="mb-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">
                {error}
              </div>
            )}

            {loadingMessages && (
              <div className="h-full flex items-center justify-center text-sm text-gray-500 gap-2">
                <Loader2 size={17} className="animate-spin" /> Memuat percakapan...
              </div>
            )}

            {!loadingMessages && messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center mb-3">
                  <Sparkles size={23} className="text-primary-700" />
                </div>
                <h4 className="font-bold text-gray-800">Mau tanya apa?</h4>
                <p className="text-sm text-gray-500 mt-1">Pilih contoh atau tulis kondisi lahan kamu.</p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {topicChips.map((topic) => (
                    <span key={topic} className="inline-flex items-center gap-1 rounded-full bg-white border border-primary-100 px-2.5 py-1 text-xs font-semibold text-primary-800">
                      <Leaf size={12} /> {topic}
                    </span>
                  ))}
                </div>
                <div className="w-full space-y-2 mt-4">
                  {quickPrompts.map((prompt) => (
                    <button
                      type="button"
                      key={prompt.text}
                      onClick={() => submitMessage(prompt.text)}
                      className="w-full text-left bg-white border border-gray-200 hover:border-primary-200 hover:bg-primary-50 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors"
                    >
                      <span className="block text-xs font-bold text-primary-700 mb-0.5">{prompt.label}</span>
                      {prompt.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!loadingMessages && messages.length > 0 && (
              <div className="space-y-3">
                {messages.map((message) => {
                  const isUser = message.role === 'user'
                  const intent = getMessageIntent(message)
                  const sources = message.metadata?.sources || []
                  return (
                    <div key={message.id} className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                      {!isUser && (
                        <div className="w-8 h-8 rounded-full bg-primary-800 text-white flex items-center justify-center shrink-0 mt-1">
                          <Bot size={16} />
                        </div>
                      )}
                      <div className={`max-w-[86%] rounded-2xl px-3 py-2 shadow-sm ${
                        isUser
                          ? 'bg-primary-800 text-white rounded-tr-md'
                          : 'bg-white text-gray-700 border border-gray-100 rounded-tl-md'
                      }`}>
                        {!isUser && (
                          <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-bold text-primary-800">
                            <Sparkles size={11} /> {intentLabels[intent] || 'Asisten tani'}
                          </div>
                        )}
                        <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                        {!isUser && sources.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {sources.slice(0, 3).map((source) => (
                              <span key={`${source.type}-${source.id}`} className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-600">
                                {getSourceLabel(source)}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className={`text-[10px] mt-1.5 ${isUser ? 'text-primary-100' : 'text-gray-400'}`}>
                          {formatTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                  )
                })}

                {sending && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-md px-3 py-2 text-sm text-gray-500 flex items-center gap-2 shadow-sm">
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:120ms]" />
                        <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:240ms]" />
                      </span>
                      Menyusun jawaban
                    </div>
                  </div>
                )}
                {!sending && lastAssistantMessage && (
                  <div className="pt-1">
                    <p className="text-[11px] font-semibold text-gray-400 mb-2">Lanjut tanya:</p>
                    <div className="flex flex-wrap gap-2">
                      {followUps.map((prompt) => (
                        <button
                          type="button"
                          key={prompt}
                          onClick={() => submitMessage(prompt)}
                          className="rounded-full bg-white border border-gray-200 hover:border-primary-200 hover:bg-primary-50 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-gray-100 bg-white p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Tulis pertanyaan..."
                className="input-field py-2.5"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="btn-primary px-3 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Kirim pesan"
              >
                {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="ml-auto w-14 h-14 rounded-full bg-primary-800 hover:bg-primary-900 text-white shadow-xl flex items-center justify-center transition-all hover:-translate-y-0.5"
        aria-label={open ? 'Tutup chatbot' : 'Buka chatbot'}
      >
        {open ? <X size={23} /> : <MessageCircle size={24} />}
      </button>
    </div>
  )
}

export default ChatbotToggle
