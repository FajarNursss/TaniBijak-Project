import api from './api'

const chatbotService = {
  getSessions: async () => {
    const response = await api.get('/chatbot/sessions')
    return response.data
  },
  getSession: async (sessionId) => {
    const response = await api.get(`/chatbot/sessions/${sessionId}`)
    return response.data
  },
  sendMessage: async ({ message, sessionId }) => {
    const response = await api.post('/chatbot/message', {
      message,
      session_id: sessionId || null,
    })
    return response.data
  },
}

export default chatbotService
