import api from './api'

const wisdomService = {
  getUserAll: async () => {
    const response = await api.get('/user/kearifan')
    return response.data
  },
  getAdminAll: async () => {
    const response = await api.get('/admin/kearifan')
    return response.data
  },
  create: async (data) => {
    const response = await api.post('/admin/kearifan', data)
    return response.data
  },
  update: async (id, data) => {
    const response = await api.put(`/admin/kearifan/${id}`, data)
    return response.data
  },
  delete: async (id) => {
    const response = await api.delete(`/admin/kearifan/${id}`)
    return response.data
  },
}

export default wisdomService
