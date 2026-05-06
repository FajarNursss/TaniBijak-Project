import api from './api'

const notificationService = {
  getAll: async () => {
    const response = await api.get('/notifications')
    return response.data
  },
  create: async (data) => {
    const response = await api.post('/notifications', data)
    return response.data
  },
  markAsRead: async (id) => {
    const response = await api.post(`/notifications/${id}/read`)
    return response.data
  },
  markAllRead: async () => {
    const response = await api.post('/notifications/read-all')
    return response.data
  },
  delete: async (id) => {
    const response = await api.delete(`/notifications/${id}`)
    return response.data
  },
}

export default notificationService
