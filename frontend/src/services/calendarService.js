import api from './api'

const calendarService = {
  getAll: async () => {
    const response = await api.get('/user/kalender')
    return response.data
  },
}

export default calendarService
