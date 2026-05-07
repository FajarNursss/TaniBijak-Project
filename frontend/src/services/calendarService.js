import api from './api'

const calendarService = {
  getAll: async () => {
    const response = await api.get('/user/kalender')
    return response.data
  },
  create: async (data) => {
    const response = await api.post('/user/kalender', data)
    return response.data
  },
}

export default calendarService
