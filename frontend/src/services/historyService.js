import api from './api'

const historyService = {
  getAll: async () => {
    const response = await api.get('/user/riwayat-tanam')
    return response.data
  },
  create: async (data) => {
    const response = await api.post('/user/riwayat-tanam', data)
    return response.data
  },
  update: async (id, data) => {
    const response = await api.put(`/user/riwayat-tanam/${id}`, data)
    return response.data
  },
  delete: async (id) => {
    const response = await api.delete(`/user/riwayat-tanam/${id}`)
    return response.data
  },
}

export default historyService
