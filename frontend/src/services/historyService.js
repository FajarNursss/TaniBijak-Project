import api from './api'

const historyService = {
  getAll: async () => {
    const response = await api.get('/user/riwayat-tanam')
    return response.data
  },
}

export default historyService
